import { configureSequences } from './core/configure-sequences';
import { incomeSequence } from './sequences/income';
import { initializeSequenceUsecase } from './use-cases/initialize-sequence';

const { sequences, stepsMap } = configureSequences([incomeSequence]);

export const createSequenceController = () => {
  const rememberCurrentStep = () => {};
  const initializeSequence = initializeSequenceUsecase(sequences, stepsMap);

  return {
    initializeSequence: (sequenceName: string) =>
      initializeSequence(rememberCurrentStep, sequenceName),
  };
};
