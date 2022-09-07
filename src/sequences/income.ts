import { SequenceDescription } from '../core/data/sequence-description';

export const incomeSequence: SequenceDescription = {
  id: 'income',
  name: 'Поступления',
  steps: [
    {
      id: 'date',
      config: {
        label: 'Введите дату:',
        staticChoices: ['Сегодня'],
      },
    },
  ],
};
