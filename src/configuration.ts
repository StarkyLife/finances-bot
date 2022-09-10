import dotenv from 'dotenv';

import { GoogleConfig } from './devices/data/google-config';

dotenv.config();

const env = (name: string, defaultValue?: string): string => {
  const value = process.env[name];

  if (defaultValue !== undefined) {
    return value || defaultValue;
  }

  if (!value) {
    throw new Error(`${name} is not set!`);
  }

  return value;
};

type Configuration = {
  botWebhookDomain: string;
  botServerPort: string;
  botToken: string;
  google: GoogleConfig;
  defaultUser: string;
  incomeSheetId: string;
  incomeRange: string;
  outcomeSheetId: string;
  outcomeRange: string;
};

export const configuration: Configuration = {
  botWebhookDomain: env('BOT_WEBHOOK_DOMAIN', ''),
  botServerPort: env('BOT_SERVER_PORT', '8080'),
  botToken: env('BOT_TOKEN'),
  google: {
    email: env('CLIENT_EMAIL'),
    key: env('PRIVATE_KEY'),
  },
  defaultUser: env('DEFAULT_USER', ''),
  incomeSheetId: env('INCOME_SHEET_ID', ''),
  incomeRange: env('INCOME_RANGE', ''),
  outcomeSheetId: env('OUTCOME_SHEET_ID', ''),
  outcomeRange: env('OUTCOME_RANGE', ''),
};
