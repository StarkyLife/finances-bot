import { sequenceController } from '../src/sequence-controller';

it('should fill steps and send to google sheet', async () => {
  const USER_ID = 'StarkyLife';

  sequenceController.initializeSequence(USER_ID, 'Поступления');

  sequenceController.processStep(USER_ID, '01.01.2022');
  sequenceController.processStep(USER_ID, 'Инвестиции');

  const summary = sequenceController.getSequenceSummary(USER_ID);

  expect(summary).toEqual([
    {
      id: 'income_date',
      label: 'Дата',
      value: '01.01.2022',
    },
    {
      id: 'income_category',
      label: 'Категория',
      value: 'Инвестиции',
    },
  ]);

  await expect(sequenceController.saveSequenceDataToGoogleSheet(USER_ID)).resolves.toBeUndefined();
});
