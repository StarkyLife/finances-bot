import { Context, Markup, Telegraf } from 'telegraf';

import { configuration } from './configuration';
import { botController } from './ui/bot-controller';
import { Answer } from './ui/data/answer';

const bot = new Telegraf(configuration.botToken);

const getUserId = (ctx: Context) => ctx.from?.username || '';
const replyAnswers = async (ctx: Context, answers: Answer[]) => {
  for (const { markdownText, choices } of answers) {
    await ctx.replyWithMarkdown(
      markdownText,
      choices &&
        (choices.length
          ? Markup.keyboard(choices.map((choice) => Markup.button.text(choice)))
          : Markup.removeKeyboard()),
    );
  }
};
const scheduleWildberriesNotifications = () => {
  const checkWBNotifications = botController.createWBNotificationsChecker(
    async (chatId, markdownText) => {
      await bot.telegram.sendMessage(chatId, markdownText, { parse_mode: 'Markdown' });
    },
  );

  setInterval(() => {
    checkWBNotifications();
  }, 1000 * 60 * 5);
};

bot.start(async (ctx) => {
  const answers = await botController.rememberUserChat(getUserId(ctx), `${ctx.message.chat.id}`);
  await replyAnswers(ctx, answers);

  await ctx.replyWithMarkdown(
    `*Доступные действия*:\n
    /newoperation - Новая операция`,
    Markup.removeKeyboard(),
  );
});
bot.command('newoperation', async (ctx: Context) => {
  const answers = await botController.showAvailabelSequences(getUserId(ctx));
  await replyAnswers(ctx, answers);
});
bot.command('cancel', async (ctx) => {
  const answers = await botController.cancelSequence(getUserId(ctx));
  await replyAnswers(ctx, answers);
});

bot.on('text', async (ctx) => {
  const userId = getUserId(ctx);
  const answers = await botController.processSequence(userId, ctx.message.text);
  await replyAnswers(ctx, answers);
});

if (configuration.botWebhookDomain) {
  const { botWebhookDomain, botServerPort } = configuration;
  bot
    .launch({
      webhook: {
        domain: botWebhookDomain,
        port: botServerPort ? +botServerPort : undefined,
      },
    })
    .then(() => console.log('Webhook bot listening on port', botServerPort))
    .then(scheduleWildberriesNotifications);
} else {
  bot.launch().then(scheduleWildberriesNotifications);
}

process.on('unhandledRejection', (error) => {
  console.error(error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
