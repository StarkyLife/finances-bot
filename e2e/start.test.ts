import { createSequenceController } from '../src/sequence-controller';

it('should initialize sequence', async () => {
  const controller = createSequenceController();

  const stepInfo = controller.initializeSequence('Поступления');

  expect(stepInfo).toEqual({
    id: 'income_date',
    label: 'Введите дату:',
    choices: ['Сегодня']
  });
});
