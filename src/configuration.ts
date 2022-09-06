import dotenv from 'dotenv';
import { GoogleConfig } from './devices/data/google-config';

dotenv.config();

type Configuration = {
  google: GoogleConfig;
};

export const configuration: Configuration = {
  google: {
    email: process.env.CLIENT_EMAIL,
    key: process.env.PRIVATE_KEY,
  },
};
