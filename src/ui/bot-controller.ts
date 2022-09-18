import { configuration } from '../configuration';
import { configureSequences } from '../core/configure-sequences';
import { connectToChatsStorage } from '../devices/chatsStorage';
import { connectToCurrentStepStorage } from '../devices/current-step-storage';
import { connectToGoogleSheet } from '../devices/google-sheet';
import { connectToOrdersCache } from '../devices/orders-cache';
import { connectToSequenceDataStorage } from '../devices/sequence-data-storage';
import { createUserGateway } from '../devices/users';
import { connectToWildberries } from '../devices/wildberries';
import { incomeSequence } from '../sequences/income';
import { outcomeSequence } from '../sequences/outcome';
import { cancelSequenceUsecase } from '../use-cases/cancel-sequence';
import { initializeSequenceUsecase } from '../use-cases/initialize-sequence';
import { presentNewOrdersUsecase } from '../use-cases/present-new-orders';
import { presentSequenceDataUsecase } from '../use-cases/present-sequence-data';
import { processStepUsecase } from '../use-cases/process-step';
import { saveSequenceUsecase } from '../use-cases/save-sequence';
import { Answer } from './data/answer';
import { LABELS } from './data/labels';

const { sequences, stepsMap } = configureSequences([incomeSequence, outcomeSequence]);

const userGateway = createUserGateway([
  {
    id: configuration.defaultUser,
    wildberriesToken: configuration.wildberriesToken,
    sheetInfos: [
      {
        sequenceId: incomeSequence.id,
        sheetId: configuration.incomeSheetId,
        range: configuration.incomeRange,
      },
      {
        sequenceId: outcomeSequence.id,
        sheetId: configuration.outcomeSheetId,
        range: configuration.outcomeRange,
      },
    ],
  },
]);
const { append: saveInGoogleSheet } = connectToGoogleSheet(configuration.google);

const initializeSequence = initializeSequenceUsecase(sequences, stepsMap);
const processStep = processStepUsecase(stepsMap);
const presentSequenceData = presentSequenceDataUsecase(stepsMap);
const saveSequence = saveSequenceUsecase(stepsMap);

const handleErrors = async (action: () => Promise<Answer[]>) => {
  try {
    const answers = await action();
    return answers;
  } catch (e) {
    const error = e as Error;
    console.log(error.stack);
    return [
      {
        markdownText: error.message,
        choices: [],
      },
    ];
  }
};

export const botController = {
  labels: LABELS,
  showAvailabelSequences: (userId: string): Promise<Answer[]> =>
    handleErrors(async () => {
      userGateway.authorize(userId);

      const availableSequences = sequences.map((s) => s.name);

      return [
        {
          markdownText: LABELS.newOperation,
        },
        {
          markdownText: LABELS.chooseOperation,
          choices: availableSequences,
        },
      ];
    }),
  cancelSequence: (userId: string): Promise<Answer[]> =>
    handleErrors(async () => {
      userGateway.authorize(userId);

      const { clearSequenceData } = connectToSequenceDataStorage(userId);
      const { rememberCurrentStep } = connectToCurrentStepStorage(userId);

      cancelSequenceUsecase(clearSequenceData, rememberCurrentStep);
      return [
        {
          markdownText: LABELS.successfulCancel,
          choices: [],
        },
      ];
    }),
  processSequence: (userId: string, message: string): Promise<Answer[]> =>
    handleErrors(async () => {
      userGateway.authorize(userId);

      const getSheetInfo = userGateway.createSheetInfoGetter(userId);
      const { createSequenceData, getSequenceData, clearSequenceData, saveStep } =
        connectToSequenceDataStorage(userId);
      const { getCurrentStep, rememberCurrentStep } = connectToCurrentStepStorage(userId);

      const availableSequences = sequences.map((s) => s.name);
      if (availableSequences.includes(message)) {
        const step = initializeSequence(rememberCurrentStep, createSequenceData, message);

        return [
          {
            markdownText: step.label,
            choices: step.choices ?? [],
          },
        ];
      }

      if (message === LABELS.cancel) {
        cancelSequenceUsecase(clearSequenceData, rememberCurrentStep);
        return [
          {
            markdownText: LABELS.successfulCancel,
            choices: [],
          },
        ];
      }

      if (message === LABELS.submit) {
        await saveSequence({
          getSequenceData,
          clearSequenceData,
          getSheetInfo,
          saveInGoogleSheet,
        });

        return [
          {
            markdownText: LABELS.successfulSave,
            choices: [],
          },
        ];
      }

      const nextStep = processStep(getCurrentStep, rememberCurrentStep, saveStep, message);

      if (nextStep) {
        return [
          {
            markdownText: nextStep.label,
            choices: nextStep.choices ?? [],
          },
        ];
      } else {
        const summary = presentSequenceData(getSequenceData);
        return [
          {
            markdownText: summary
              .map((stepSummary) => `- *${stepSummary.label}*: ${stepSummary.value}`)
              .join('\n'),
            choices: [LABELS.submit, LABELS.cancel],
          },
        ];
      }
    }),
  rememberUserChat: (userId: string, chatId: string) =>
    handleErrors(async () => {
      userGateway.authorize(userId);
      const chatsStorage = connectToChatsStorage(userId);

      chatsStorage.rememberChat(chatId);

      return [{ markdownText: LABELS.youAreRemembered }];
    }),
  createWBNotificationsChecker:
    (messageSender: (chatId: string, markdownText: string) => Promise<void>) => async () => {
      const users = userGateway.getAllUsers();
      await Promise.all(
        users.map(async (user) => {
          if (!user.wildberriesToken) return;

          const chatsStorage = connectToChatsStorage(user.id);

          const chatId = chatsStorage.getChat();
          if (chatId.isNone()) return;

          const wildberriesSDK = connectToWildberries(user.wildberriesToken);
          const ordersCache = connectToOrdersCache(user.id);
          const presentNewOrders = presentNewOrdersUsecase(
            wildberriesSDK.getOrders,
            ordersCache.getOrdersIds,
            ordersCache.updateOrdersIds,
          );

          try {
            const orders = await presentNewOrders();
            for (const order of orders) {
              await messageSender(
                chatId.value,
                [
                  `*Номер заказа* - ${order.id}`,
                  `*Дата создания* - ${order.dateCreated}`,
                  `*Пункт назначения* - ${order.officeAddress}`,
                  `*Цена* - ${order.price}`,
                ].join('\n'),
              );
            }
          } catch (e) {
            console.log(
              `User ${user.id} could not get new orders! Reason: ${(e as Error).message}`,
            );
          }
        }),
      );
    },
};
