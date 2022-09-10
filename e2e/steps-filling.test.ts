import { sequenceController } from '../src/ui/sequence-controller';

const USER_ID = 'StarkyLife';

it('should fill steps and send to google sheet', async () => {
  expect(sequenceController.showAvailabelSequences(USER_ID)).toEqual([
    {
      markdownText: sequenceController.labels.newOperation,
    },
    {
      markdownText: sequenceController.labels.chooseOperation,
      choices: ['Поступления', 'Расходы'],
    },
  ]);

  await sequenceController.processSequence(USER_ID, 'Поступления');
  await sequenceController.processSequence(USER_ID, '01.01.2022');
  await sequenceController.processSequence(USER_ID, 'инвестиции');
  await sequenceController.processSequence(USER_ID, 'Тестовый комментарий');
  await sequenceController.processSequence(USER_ID, '10000');
  await sequenceController.processSequence(USER_ID, 'кредитка');

  await expect(
    sequenceController.processSequence(USER_ID, sequenceController.labels.submit),
  ).resolves.toEqual([
    {
      markdownText: sequenceController.labels.successfulSave,
      choices: [],
    },
  ]);
});

it('should cancel started sequence', async () => {
  await sequenceController.processSequence(USER_ID, 'Поступления');
  expect(sequenceController.cancelSequence(USER_ID)).toEqual([
    {
      markdownText: sequenceController.labels.successfulCancel,
      choices: [],
    },
  ]);
});
