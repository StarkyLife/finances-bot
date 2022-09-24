import { botController } from '../src/ui/bot-controller';

const USER_ID = 'StarkyLife';

it('should fill steps and send to google sheet', async () => {
  await expect(botController.showAvailabelSequences(USER_ID)()).resolves.toEqual([
    {
      markdownText: botController.labels.newOperation,
    },
    {
      markdownText: botController.labels.chooseOperation,
      choices: ['Поступления', 'Расходы'],
    },
  ]);

  await botController.processSequence(USER_ID, 'Поступления')();
  await botController.processSequence(USER_ID, 'Сегодня')();
  await botController.processSequence(USER_ID, 'инвестиции')();
  await botController.processSequence(USER_ID, 'Тестовый комментарий')();
  await botController.processSequence(USER_ID, '10000')();
  await botController.processSequence(USER_ID, 'кредитка')();

  await expect(
    botController.processSequence(USER_ID, botController.labels.submit)(),
  ).resolves.toEqual([
    {
      markdownText: botController.labels.successfulSave,
      choices: [],
    },
  ]);
});

it('should cancel started sequence', async () => {
  await botController.processSequence(USER_ID, 'Поступления')();
  await expect(botController.cancelSequence(USER_ID)()).resolves.toEqual([
    {
      markdownText: botController.labels.successfulCancel,
      choices: [],
    },
  ]);
});
