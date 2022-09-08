import { createSequenceController } from '../src/sequence-controller';

it('should fill steps and send to google sheet', async () => {
  const controller = createSequenceController();

  const stepInfo = controller.initializeSequence('Поступления');

  expect(stepInfo).toEqual({
    id: 'income_date',
    label: 'Введите дату:',
    choices: ['Сегодня'],
  });

  const nextStepInfo = controller.processStep('01.01.2022');

  expect(nextStepInfo).toEqual({
    id: 'income_category',
    label: 'Введите категорию:',
    choices: ['Инвестиции'],
  });

  const summary = controller.getSequenceSummary();

  expect(summary).toEqual([
    {
      id: 'income_date',
      label: 'Дата',
      value: '01.01.2022',
    },
  ]);

  await expect(controller.saveSequenceDataToGoogleSheet()).resolves.toBeUndefined();
});
