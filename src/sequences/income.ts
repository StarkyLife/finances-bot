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
        staticChoices: ['инвестиции', 'выплаты WB'],
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
      id: 'money-account',
      config: {
        label: 'Введите счет:',
        summaryLabel: 'Счет',
        staticChoices: [
          'кредитка',
          'личный счет',
          'инвестиции',
          'расчетный счет Точка',
          'оплатил Ильшат',
        ],
      },
    },
  ],
};
