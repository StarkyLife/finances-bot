import dotenv from 'dotenv';
import { GoogleConfig } from './devices/data/google-config';

dotenv.config();

type Configuration = {
  google: GoogleConfig;
  defaultUser: string;
  defaultSheetId: string;
  defaultRange: string;
};

export const configuration: Configuration = {
  google: {
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY,
  },
  defaultUser: process.env.DEFAULT_USER || '',
  defaultSheetId: process.env.DEFAULT_SHEET_ID || '',
  defaultRange: process.env.DEFAULT_RANGE || '',
};
