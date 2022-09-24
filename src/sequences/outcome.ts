import { format } from 'date-fns';
import * as O from 'fp-ts/Option';

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
        transformer: O.some((value) =>
          value === 'Сегодня' ? format(new Date(), 'dd.MM.yyyy') : value,
        ),
      },
    },
    {
      id: 'category',
      config: {
        label: 'Введите категорию:',
        summaryLabel: 'Категория',
        staticChoices: [
          'Обучение на курсе',
          'Закупка товара',
          'Товары для комплектации',
          'Доставка самостоятельная',
          'Доставка из Китая',
          'Фулфилмент',
          'Карго Южные ворота',
          'Фотосессия',
          'Сервис выкупа MPBoost',
          'Товары для упаковки',
          'Оплата налогов',
          'Приемка товара',
          'Комиссия посреднику за пополнение Алипей',
          'Закупка оборудования',
          'Маркетинг',
          'Самостоятельный выкуп',
          'Кредиты',
        ],
        transformer: O.none,
      },
    },
    {
      id: 'comment',
      config: {
        label: 'Введите комментарий:',
        summaryLabel: 'Комментарий',
        transformer: O.none,
      },
    },
    {
      id: 'amount',
      config: {
        label: 'Введите сумму:',
        summaryLabel: 'Сумма',
        transformer: O.none,
      },
    },
    {
      id: 'quantity',
      config: {
        label: 'Введите количество:',
        summaryLabel: 'Количество',
        transformer: O.none,
      },
    },
    {
      id: 'money-account',
      config: {
        label: 'С какого счета списались деньги?',
        summaryLabel: 'Счет',
        staticChoices: [
          'кредитка',
          'личный счет',
          'инвестиции',
          'расчетный счет Точка',
          'оплатил Ильшат',
        ],
        transformer: O.none,
      },
    },
    {
      id: 'purchase-place',
      config: {
        label: 'Где/у кого куплено?',
        summaryLabel: 'Где/у кого куплено',
        transformer: O.none,
      },
    },
  ],
};
