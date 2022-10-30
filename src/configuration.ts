import dotenv from 'dotenv';
import { identity, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { GoogleConfig } from './devices/data/google-config';

dotenv.config();

const env = (name: string, defaultValue?: string): string =>
  pipe(
    O.fromNullable(process.env[name]),
    O.alt(() => O.fromNullable(defaultValue)),
    O.fold(() => {
      throw new Error(`${name} is not set!`);
    }, identity),
  );

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
  wildberriesUrl: string;
  wildberriesToken: string;
};

export const configuration: Configuration = {
  botWebhookDomain: env('BOT_WEBHOOK_DOMAIN', ''),
  botServerPort: env('BOT_SERVER_PORT', ''),
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
  wildberriesUrl: env('WILDBERRIES_URL'),
  wildberriesToken: env('WILDBERRIES_TOKEN'),
};
