import dotenv from 'dotenv';

import { GoogleConfig } from './devices/data/google-config';

dotenv.config();

const env = (name: string, defaultValue?: string): string => {
  const value = process.env[name];

  if (defaultValue) {
    return value || defaultValue;
  }

  if (!value) {
    throw new Error(`${name} is not set!`);
  }

  return value;
};

type Configuration = {
  botToken: string;
  google: GoogleConfig;
  defaultUser: string;
  incomeSheetId: string;
  incomeRange: string;
  outcomeSheetId: string;
  outcomeRange: string;
};

export const configuration: Configuration = {
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
