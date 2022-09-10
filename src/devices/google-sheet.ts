import { google } from 'googleapis';
import { SheetInfo } from '../core/data/sheet';
import { GoogleConfig } from './data/google-config';

export const connectToGoogleSheet = (config: GoogleConfig) => {
  const { spreadsheets } = google.sheets({
    version: 'v4',
    auth: new google.auth.JWT({
      email: config.email,
      key: config.key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    }),
  });

  return {
    append: async (sheetInfo: SheetInfo, values: Array<Array<string | undefined>>) => {
      // append finds table and adds to new row after last filled
      await spreadsheets.values.append({
        spreadsheetId: sheetInfo.id,
        range: sheetInfo.range,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    },
  };
};
