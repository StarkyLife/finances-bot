import * as O from 'fp-ts/Option';

import { configuration } from '../configuration';
import { SheetInfo } from '../core/data/sheet';
import { connectToGoogleSheet } from './google-sheet';

it('should append data', async () => {
  const sheetInfo: SheetInfo = {
    id: '1CagUnszcw4xYZRT69N_0wiyRE9C7TlwhR76dBRCh5_A',
    range: 'Sheet1',
  };

  await expect(
    connectToGoogleSheet(configuration.google).append(sheetInfo, [
      [O.some('Hello'), O.some('my friend')],
    ]),
  ).resolves.toBeUndefined();
});
