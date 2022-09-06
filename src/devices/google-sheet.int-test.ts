import dotenv from 'dotenv';
import { SheetInfo } from '../core/data/sheet';
import { GoogleConfig } from './data/google-config';
import { appendDataToGoogleSheet } from './google-sheet';

dotenv.config();

const googleConfig: GoogleConfig = {
  email: process.env.CLIENT_EMAIL,
  key: process.env.PRIVATE_KEY,
};

it('should append data', async () => {
  const sheetInfo: SheetInfo = {
    id: '12x9yqsk_SHPTUx0SfQhXbw2Ad5JUgfO2BVnPRbBvcuA',
    range: 'Sheet1',
  };

  await expect(
    appendDataToGoogleSheet(googleConfig)(sheetInfo, [['Hello', 'my friend']]),
  ).resolves.toBeUndefined();
});
