import { configuration } from './configuration';
import { configureSequences } from './core/configure-sequences';
import { SheetInfo } from './core/data/sheet';
import { StoredStep } from './core/data/step';
import { appendDataToGoogleSheet } from './devices/google-sheet';
import { incomeSequence } from './sequences/income';
import { initializeSequenceUsecase } from './use-cases/initialize-sequence';
import { presentSequenceDataUsecase } from './use-cases/present-sequence-data';
import { processStepUsecase } from './use-cases/process-step';
import { saveSequenceUsecase } from './use-cases/save-sequence';

const { sequences, stepsMap } = configureSequences([incomeSequence]);

export const createSequenceController = () => {
  let currentStep: string | undefined = undefined;
  let sequenceData: StoredStep[] = [];

  const rememberCurrentStep = (stepId: string | undefined) => {
    currentStep = stepId;
  };
  const getCurrentStep = () => currentStep;
  const saveStep = (id: string, value: string) => {
    sequenceData.push({ id, value });
  };
  const getSequenceData = () => sequenceData;
  const clearSequenceData = () => {
    sequenceData = [];
  };
  const getSheetInfo = (): SheetInfo => ({
    id: '12x9yqsk_SHPTUx0SfQhXbw2Ad5JUgfO2BVnPRbBvcuA',
    range: 'Sheet1',
  });
  const saveInGoogleSheet = appendDataToGoogleSheet(configuration.google);

  const initializeSequence = initializeSequenceUsecase(sequences, stepsMap);
  const processStep = processStepUsecase(stepsMap);
  const presentSequenceData = presentSequenceDataUsecase(stepsMap);
  const saveSequence = saveSequenceUsecase(stepsMap);

  return {
    initializeSequence: (sequenceName: string) =>
      initializeSequence(rememberCurrentStep, sequenceName),
    processStep: (stepValue: string) =>
      processStep(getCurrentStep, rememberCurrentStep, saveStep, stepValue),
    getSequenceSummary: () => presentSequenceData(getSequenceData),
    saveSequenceDataToGoogleSheet: () =>
      saveSequence({
        getSequenceData,
        clearSequenceData,
        getSheetInfo,
        saveInGoogleSheet,
      }),
  };
};
