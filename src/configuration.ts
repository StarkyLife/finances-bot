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
  defaultSheetId: string;
  defaultRange: string;
};

export const configuration: Configuration = {
  botToken: env('BOT_TOKEN'),
  google: {
    email: env('CLIENT_EMAIL'),
    key: env('PRIVATE_KEY'),
  },
  defaultUser: env('DEFAULT_USER', ''),
  defaultSheetId: env('DEFAULT_SHEET_ID', ''),
  defaultRange: env('DEFAULT_RANGE', ''),
};
