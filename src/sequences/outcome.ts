import { format } from 'date-fns';
import { SequenceDescription } from '../core/data/sequence-description';

export const outcomeSequence: SequenceDescription = {
  id: 'outcome',
  name: 'Расходы',
  steps: [
    {
      id: 'date',
      config: {
        label: 'Введите дату покупки:',
        summaryLabel: 'Дата',
        staticChoices: ['Сегодня'],
        transformer: (value) => (value === 'Сегодня' ? format(new Date(), 'dd.MM.yyyy') : value),
      },
    },
    {
      id: 'category',
      config: {
        label: 'Введите категорию:',
        summaryLabel: 'Категория',
        staticChoices: ['Обучение на курсе'],
      },
    },
    {
      id: 'comment',
      config: {
        label: 'Введите комментарий:',
        summaryLabel: 'Комментарий',
      },
    },
    {
      id: 'amount',
      config: {
        label: 'Введите сумму:',
        summaryLabel: 'Сумма',
      },
    },
    {
      id: 'quantity',
      config: {
        label: 'Введите количество:',
        summaryLabel: 'Количество',
      },
    },
    {
      id: 'money-account',
      config: {
        label: 'С какого счета списались деньги?',
        summaryLabel: 'Счет',
        staticChoices: ['Кредитка', 'Расчетный счет'],
      },
    },
    {
      id: 'purchase-place',
      config: {
        label: 'Где/у кого куплено?',
        summaryLabel: 'Где/у кого куплено',
      },
    },
  ],
};
