import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/function';
import * as O from 'fp-ts/Option';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

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
        return pipe(
          initializeSequence(rememberCurrentStep, createSequenceData, message),
          E.fold(
            (e) => {
              throw e;
            },
            (step) => [
              {
                markdownText: step.label,
                choices: step.choices ?? [],
              },
            ],
          ),
        );
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
        const callSaveSequence = pipe(
          saveSequence({
            getSequenceData,
            clearSequenceData,
            getSheetInfo,
            saveInGoogleSheet,
          }),
          TE.fold((e) => {
            throw e;
          }, T.of),
        );

        await callSaveSequence();

        return [
          {
            markdownText: LABELS.successfulSave,
            choices: [],
          },
        ];
      }

      const handleEndOfSequence = () =>
        pipe(
          presentSequenceData(getSequenceData),
          E.map((summary): Answer[] => [
            {
              markdownText: summary
                .map((stepSummary) => `- *${stepSummary.label}*: ${stepSummary.value}`)
                .join('\n'),
              choices: [LABELS.submit, LABELS.cancel],
            },
          ]),
        );

      return pipe(
        processStep(getCurrentStep, rememberCurrentStep, saveStep, message),
        E.chain((nextStep) =>
          pipe(
            nextStep,
            O.fold(handleEndOfSequence, (step) =>
              E.of([
                {
                  markdownText: step.label,
                  choices: step.choices ?? [],
                },
              ]),
            ),
          ),
        ),
        E.fold((e) => {
          throw e;
        }, identity),
      );
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
          if (O.isNone(chatId)) return;

          const wildberriesSDK = connectToWildberries(user.wildberriesToken);
          const ordersCache = connectToOrdersCache(user.id);
          const presentNewOrders = presentNewOrdersUsecase(
            wildberriesSDK.getOrders,
            ordersCache.getOrdersIds,
            ordersCache.updateOrdersIds,
          );

          try {
            const callPresentNewOrders = pipe(
              presentNewOrders(),
              TE.fold((e) => {
                throw e;
              }, T.of),
            );
            const orders = await callPresentNewOrders();
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
