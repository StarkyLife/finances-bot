import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { flow, pipe } from 'fp-ts/function';
import * as I from 'fp-ts/Identity';
import * as IOE from 'fp-ts/IOEither';
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
import { takeOrderToWorkUsecase } from '../use-cases/take-order-to-work';
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

const handleError = TE.fold<Error, Answer[], Answer[]>((e) => {
  console.log(e.stack);

  return T.of([
    {
      markdownText: e.message,
      choices: [],
    },
  ]);
}, T.of);

export const botController = {
  labels: LABELS,
  showAvailabelSequences: (userId: string) =>
    pipe(
      userGateway.authorize(userId),
      E.map((): Answer[] => [
        {
          markdownText: LABELS.newOperation,
        },
        {
          markdownText: LABELS.chooseOperation,
          choices: sequences.map((s) => s.name),
        },
      ]),
      TE.fromEither,
      handleError,
    ),
  cancelSequence: (userId: string) =>
    pipe(
      userGateway.authorize(userId),
      E.map(() =>
        pipe(
          connectToSequenceDataStorage(userId),
          I.bindTo('sequenceDataStorage'),
          I.bind('currentStepStorage', () => connectToCurrentStepStorage(userId)),
          ({ sequenceDataStorage, currentStepStorage }) =>
            cancelSequenceUsecase(
              sequenceDataStorage.clearSequenceData,
              currentStepStorage.rememberCurrentStep,
            ),
          (): Answer[] => [
            {
              markdownText: LABELS.successfulCancel,
              choices: [],
            },
          ],
        ),
      ),
      TE.fromEither,
      handleError,
    ),
  processSequence: (userId: string, message: string) =>
    pipe(
      userGateway.authorize(userId),
      TE.fromEither,
      TE.chain(() =>
        pipe(
          userGateway.createSheetInfoGetter(userId),
          I.bindTo('getSheetInfo'),
          I.bind('sequenceDataStorage', () => connectToSequenceDataStorage(userId)),
          I.bind('currentStepStorage', () => connectToCurrentStepStorage(userId)),
          ({
            getSheetInfo,
            sequenceDataStorage,
            currentStepStorage,
          }): TE.TaskEither<Error, Answer[]> => {
            const availableSequences = sequences.map((s) => s.name);
            if (availableSequences.includes(message)) {
              return pipe(
                initializeSequence(
                  currentStepStorage.rememberCurrentStep,
                  sequenceDataStorage.createSequenceData,
                  message,
                ),
                E.map((step) => [
                  {
                    markdownText: step.label,
                    choices: step.choices ?? [],
                  },
                ]),
                TE.fromEither,
              );
            }

            if (message === LABELS.cancel) {
              return pipe(
                cancelSequenceUsecase(
                  sequenceDataStorage.clearSequenceData,
                  currentStepStorage.rememberCurrentStep,
                ),
                (): Answer[] => [
                  {
                    markdownText: LABELS.successfulCancel,
                    choices: [],
                  },
                ],
                TE.of,
              );
            }

            if (message === LABELS.submit) {
              return pipe(
                saveSequence({
                  getSequenceData: sequenceDataStorage.getSequenceData,
                  clearSequenceData: sequenceDataStorage.clearSequenceData,
                  getSheetInfo,
                  saveInGoogleSheet,
                }),
                TE.map((): Answer[] => [
                  {
                    markdownText: LABELS.successfulSave,
                    choices: [],
                  },
                ]),
              );
            }

            return pipe(
              processStep(
                currentStepStorage.getCurrentStep,
                currentStepStorage.rememberCurrentStep,
                sequenceDataStorage.saveStep,
                message,
              ),
              E.chain(
                O.fold(
                  () =>
                    pipe(
                      presentSequenceData(sequenceDataStorage.getSequenceData),
                      E.map((summary): Answer[] => [
                        {
                          markdownText: summary
                            .map((stepSummary) => `- *${stepSummary.label}*: ${stepSummary.value}`)
                            .join('\n'),
                          choices: [LABELS.submit, LABELS.cancel],
                        },
                      ]),
                    ),
                  (step) =>
                    E.of([
                      {
                        markdownText: step.label,
                        choices: step.choices ?? [],
                      },
                    ]),
                ),
              ),
              TE.fromEither,
            );
          },
        ),
      ),
      handleError,
    ),
  rememberUserChat: (userId: string, chatId: string) =>
    pipe(
      userGateway.authorize(userId),
      E.map(() => connectToChatsStorage(userId)),
      E.map((chatsStorage) => chatsStorage.rememberChat(chatId)),
      IOE.fromEither,
      IOE.chain((io) => IOE.fromIO(io)),
      IOE.map((): Answer[] => [{ markdownText: LABELS.youAreRemembered }]),
      TE.fromIOEither,
      handleError,
    ),
  checkWBNotifications: () =>
    pipe(
      userGateway.getAllUsers(),
      A.map((user) =>
        pipe(
          O.fromNullable(user.wildberriesToken),
          O.bindTo('wildberriesToken'),
          O.bind('chatId', () => connectToChatsStorage(user.id).getChat()()),
          O.bind('wildberriesSDK', ({ wildberriesToken }) =>
            O.of(connectToWildberries(configuration.wildberriesUrl, wildberriesToken)),
          ),
          O.bind('ordersCache', () => O.of(connectToOrdersCache(user.id))),
          O.fold(
            () => T.of([]),
            ({ chatId, wildberriesSDK, ordersCache }) =>
              pipe(
                presentNewOrdersUsecase(
                  wildberriesSDK.getOrders,
                  ordersCache.getOrdersIds,
                  ordersCache.updateOrdersIds,
                ),
                TE.map(
                  A.map((order) => ({
                    chatId,
                    markdownText: [
                      `*Номер заказа* - ${order.id}`,
                      `*Дата создания* - ${order.dateCreated}`,
                      `*Пункт назначения* - ${order.officeAddress}`,
                      `*Цена* - ${order.price}`,
                    ].join('\n'),
                    actions: [
                      {
                        text: 'Взять в работу',
                        data: order.id,
                      },
                    ],
                  })),
                ),
                TE.fold(
                  (e) =>
                    T.of([
                      {
                        chatId,
                        markdownText: `User ${user.id} could not get new orders! Reason: ${e.message}`,
                        actions: [],
                      },
                    ]),
                  T.of,
                ),
              ),
          ),
        ),
      ),
      A.sequence(T.ApplicativeSeq),
      T.map(A.flatten),
    ),
  takeOrderToWork: (userId: string, orderId: string | undefined) =>
    pipe(
      TE.Do,
      TE.bind('orderId', () => pipe(orderId, TE.fromNullable(new Error('Order ID is not sent!')))),
      TE.bind('token', () =>
        pipe(
          userGateway.authorize(userId),
          E.chain(
            flow(
              (user) => O.fromNullable(user.wildberriesToken),
              E.fromOption(() => new Error('No wildberries token!')),
            ),
          ),
          TE.fromEither,
        ),
      ),
      TE.bind('sdk', ({ token }) =>
        TE.of(connectToWildberries(configuration.wildberriesUrl, token)),
      ),
      TE.chain(({ sdk, orderId }) => takeOrderToWorkUsecase(sdk.changeWBOrderStatus, orderId)),
      TE.map(() => [
        {
          markdownText: LABELS.successfulStatusChange,
          choices: [],
        },
      ]),
      handleError,
    ),
};
