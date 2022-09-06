import { Sequence } from './core/data/sequence';
import { Step } from './core/data/step';
import { initializeSequenceUsecase } from './use-cases/initialize-sequence';

export const createSequenceController = () => {
  const sequences: Sequence[] = [
    { name: 'Поступления', firstStepId: 'income_date' }
  ];
  const stepsMap = new Map<string, Step>([
    ['income_date', {
      label: 'Введите дату:',
      staticChoices: ['Сегодня'],
      next: undefined
    }]
  ]);

  const initializeSequence = initializeSequenceUsecase(sequences, stepsMap);

  return {
    initializeSequence,
  };
};
