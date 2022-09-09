import { sequenceController } from '../src/sequence-controller';

it('should fill steps and send to google sheet', async () => {
  const USER_ID = 'StarkyLife';

  sequenceController.initializeSequence(USER_ID, 'Расходы');

  sequenceController.processStep(USER_ID, '01.01.2022');
  sequenceController.processStep(USER_ID, 'Обучение на курсе');
  sequenceController.processStep(USER_ID, 'Тестовый комментарий');
  sequenceController.processStep(USER_ID, '10000');
  sequenceController.processStep(USER_ID, '1');
  sequenceController.processStep(USER_ID, 'Кредитка');
  sequenceController.processStep(USER_ID, 'У блогера');

  const summary = sequenceController.getSequenceSummary(USER_ID);

  expect(summary).toEqual([
    {
      id: 'outcome_date',
      label: 'Дата',
      value: '01.01.2022',
    },
    {
      id: 'outcome_category',
      label: 'Категория',
      value: 'Обучение на курсе',
    },
    {
      id: 'outcome_comment',
      label: 'Комментарий',
      value: 'Тестовый комментарий',
    },
    {
      id: 'outcome_amount',
      label: 'Сумма',
      value: '10000',
    },
    {
      id: 'outcome_quantity',
      label: 'Количество',
      value: '1',
    },
    {
      id: 'outcome_money-account',
      label: 'Счет',
      value: 'Кредитка',
    },
    {
      id: 'outcome_purchase-place',
      label: 'Где/у кого куплено',
      value: 'У блогера',
    },
  ]);

  await expect(sequenceController.saveSequenceDataToGoogleSheet(USER_ID)).resolves.toBeUndefined();
});
