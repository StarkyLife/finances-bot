import { format } from 'date-fns';
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
        transformer: (value) => (value === 'Сегодня' ? format(new Date(), 'dd.MM.yyyy') : value),
      },
    },
    {
      id: 'category',
      config: {
        label: 'Введите категорию:',
        staticChoices: ['Инвестиции'],
      },
    },
    {
      id: 'money-account',
      config: {
        label: 'Введите счет:',
        staticChoices: ['Кредитка', 'Расчетный счет'],
      },
    },
    {
      id: 'amount',
      config: {
        label: 'Введите сумму:',
      },
    },
    {
      id: 'comment',
      config: {
        label: 'Введите комментарий:',
      },
    },
  ],
};
