import { configuration } from './configuration';
import { configureSequences } from './core/configure-sequences';
import { activateCurrentStepStorage } from './devices/current-step-storage';
import { appendDataToGoogleSheet } from './devices/google-sheet';
import { activateSequenceDataStorage } from './devices/sequence-data-storage';
import { createUserGateway } from './devices/users';
import { incomeSequence } from './sequences/income';
import { initializeSequenceUsecase } from './use-cases/initialize-sequence';
import { presentSequenceDataUsecase } from './use-cases/present-sequence-data';
import { processStepUsecase } from './use-cases/process-step';
import { saveSequenceUsecase } from './use-cases/save-sequence';

const { sequences, stepsMap } = configureSequences([incomeSequence]);

export const createSequenceController = () => {
  const userGateway = createUserGateway({
    id: configuration.defaultUser,
    sheetId: configuration.defaultSheetId,
    range: configuration.defaultRange,
  });
  const saveInGoogleSheet = appendDataToGoogleSheet(configuration.google);

  const initializeSequence = initializeSequenceUsecase(sequences, stepsMap);
  const processStep = processStepUsecase(stepsMap);
  const presentSequenceData = presentSequenceDataUsecase(stepsMap);
  const saveSequence = saveSequenceUsecase(stepsMap);

  return {
    initializeSequence: (userId: string, sequenceName: string) => {
      userGateway.authorize(userId);
      const { rememberCurrentStep } = activateCurrentStepStorage(userId);

      return initializeSequence(rememberCurrentStep, sequenceName);
    },
    processStep: (userId: string, stepValue: string) => {
      userGateway.authorize(userId);
      const { getCurrentStep, rememberCurrentStep } = activateCurrentStepStorage(userId);
      const { saveStep } = activateSequenceDataStorage(userId);

      return processStep(getCurrentStep, rememberCurrentStep, saveStep, stepValue);
    },
    getSequenceSummary: (userId: string) => {
      userGateway.authorize(userId);
      const { getSequenceData } = activateSequenceDataStorage(userId);

      return presentSequenceData(getSequenceData);
    },
    saveSequenceDataToGoogleSheet: async (userId: string) => {
      const { getSheetInfo } = userGateway.authorize(userId);
      const { getSequenceData, clearSequenceData } = activateSequenceDataStorage(userId);

      await saveSequence({
        getSequenceData,
        clearSequenceData,
        getSheetInfo,
        saveInGoogleSheet,
      });
    },
  };
};
