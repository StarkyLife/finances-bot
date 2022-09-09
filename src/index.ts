import { Context, Markup, Telegraf } from 'telegraf';
import { configuration } from './configuration';
import { StepUI } from './core/data/step';
import { sequenceController } from './sequence-controller';

const bot = new Telegraf(configuration.botToken);

const submitLabel = 'Сохранить';
const tryOneMoreTimeLabel = 'Попробовать еще раз';

const getUserId = (ctx: Context) => ctx.from?.username || '';

const goToMainMenu = async (ctx: Context) => {
  try {
    const userId = getUserId(ctx);
    const availableSequences = sequenceController.getAvailableSequence(userId);
    await ctx.replyWithMarkdown(
      `-----------------------------------\n
      *Новый раздел*
      \n-----------------------------------`,
      Markup.keyboard(availableSequences.map((name) => Markup.button.text(name))),
    );
  } catch (e) {
    await ctx.reply(
      'Не получилось достать разделы. Попробуйте еще раз',
      Markup.keyboard([Markup.button.text(tryOneMoreTimeLabel)]),
    );
  }
};

const showStep = async (ctx: Context, step: StepUI) => {
  await ctx.replyWithMarkdown(
    step.label,
    step.choices?.length
      ? Markup.keyboard(step.choices.map((a) => Markup.button.text(a)))
      : Markup.removeKeyboard(),
  );
};

const handleErrors = async (ctx: Context, asyncReplyAction: (userId: string) => Promise<void>) => {
  const userId = getUserId(ctx);
  try {
    await asyncReplyAction(userId);
  } catch (e) {
    const error = e as Error;
    console.log(error.stack);
    await ctx.reply(`User: ${userId} - ${error.message}`);
    await goToMainMenu(ctx);
  }
};

bot.start(goToMainMenu);
bot.hears(tryOneMoreTimeLabel, goToMainMenu);
bot.hears(submitLabel, async (ctx) => {
  await handleErrors(ctx, async (userId) => {
    await sequenceController.saveSequenceDataToGoogleSheet(userId);
    await ctx.reply('Все успешно сохранено!');
    await goToMainMenu(ctx);
  });
});

bot.on('text', async (ctx) => {
  const message = ctx.message.text;

  await handleErrors(ctx, async (userId) => {
    const availableSequences = sequenceController.getAvailableSequence(userId);
    if (availableSequences.includes(message)) {
      const step = sequenceController.initializeSequence(userId, message);
      await showStep(ctx, step);
      return;
    }

    const nextStep = sequenceController.processStep(userId, message);

    if (nextStep) {
      await showStep(ctx, nextStep);
    } else {
      const summary = sequenceController.getSequenceSummary(userId);
      await ctx.replyWithMarkdown(
        summary.map((stepSummary) => `- *${stepSummary.label}*: ${stepSummary.value}`).join('\n'),
        Markup.keyboard([Markup.button.text(submitLabel)]),
      );
    }
  });
});

bot.launch();

process.on('unhandledRejection', (error) => {
  console.error(error);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
