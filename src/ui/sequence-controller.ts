import { configuration } from '../configuration';
import { configureSequences } from '../core/configure-sequences';
import { connectToCurrentStepStorage } from '../devices/current-step-storage';
import { connectToGoogleSheet } from '../devices/google-sheet';
import { connectToSequenceDataStorage } from '../devices/sequence-data-storage';
import { createUserGateway } from '../devices/users';
import { incomeSequence } from '../sequences/income';
import { outcomeSequence } from '../sequences/outcome';
import { Answer } from './data/answer';
import { initializeSequenceUsecase } from '../use-cases/initialize-sequence';
import { presentSequenceDataUsecase } from '../use-cases/present-sequence-data';
import { processStepUsecase } from '../use-cases/process-step';
import { saveSequenceUsecase } from '../use-cases/save-sequence';
import { LABELS } from './data/labels';
import { cancelSequenceUsecase } from '../use-cases/cancel-sequence';

const { sequences, stepsMap } = configureSequences([incomeSequence, outcomeSequence]);

const userGateway = createUserGateway([
  {
    id: configuration.defaultUser,
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

export const sequenceController = {
  labels: LABELS,
  showAvailabelSequences: (userId: string): Answer[] => {
    try {
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
    } catch (e) {
      console.log((e as Error).stack);

      return [
        {
          markdownText: LABELS.operationsGetFail,
          choices: [LABELS.tryToGetOperationsOneMoreTime],
        },
      ];
    }
  },
  cancelSequence: (userId: string): Answer[] => {
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
  },
  processSequence: async (userId: string, message: string): Promise<Answer[]> => {
    try {
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
    } catch (e) {
      const error = e as Error;
      console.log(error.stack);
      return [
        {
          markdownText: `User: ${userId} - ${error.message}`,
          choices: [],
        },
      ];
    }
  },
};