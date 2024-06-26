import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';
import { google } from 'googleapis';

import { SaveInGoogleSheet } from '../use-cases/dependencies/google-sheet';
import { GoogleConfig } from './data/google-config';

type GoogleSheet = {
  append: SaveInGoogleSheet;
};

export const connectToGoogleSheet = (config: GoogleConfig): GoogleSheet => {
  const { spreadsheets } = google.sheets({
    version: 'v4',
    auth: new google.auth.JWT({
      email: config.email,
      key: config.key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    }),
  });

  return {
    append: TE.tryCatchK(
      async (sheetInfo, values) => {
        // append finds table and adds to new row after last filled
        await spreadsheets.values.append({
          spreadsheetId: sheetInfo.id,
          range: sheetInfo.range,
          valueInputOption: 'USER_ENTERED',
          requestBody: { values: values.map((row) => row.map((cell) => O.toUndefined(cell))) },
        });
      },
      (reason) => new Error(`${reason}`),
    ),
  };
};
