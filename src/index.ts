import dotenv from 'dotenv';
import { Telegraf } from 'telegraf';

dotenv.config();

const { BOT_TOKEN } = process.env;

if (!BOT_TOKEN) throw new Error('No bot token is provided!');

const bot = new Telegraf('random');

bot.start((ctx) => {
  ctx.reply('Hello, my friend');
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
