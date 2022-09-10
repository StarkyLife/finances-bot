import { Context, Markup, Telegraf } from 'telegraf';
import { configuration } from './configuration';
import { sequenceController } from './ui/sequence-controller';
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
const initNewOperation = async (ctx: Context) => {
  const answers = sequenceController.showAvailabelSequences(getUserId(ctx));
  await replyAnswers(ctx, answers);
};

bot.start((ctx) => {
  ctx.replyWithMarkdown(
    `*Доступные действия*:\n
    /newoperation - Новая операция`,
    Markup.removeKeyboard(),
  );
});
bot.command('newoperation', initNewOperation);
bot.hears(sequenceController.labels.tryToGetOperationsOneMoreTime, initNewOperation);

bot.on('text', async (ctx) => {
  const answers = await sequenceController.processSequence(getUserId(ctx), ctx.message.text);
  await replyAnswers(ctx, answers);
});

bot.launch();

process.on('unhandledRejection', (error) => {
  console.error(error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
