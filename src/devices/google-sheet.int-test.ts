import { configuration } from '../configuration';
import { SheetInfo } from '../core/data/sheet';
import { appendDataToGoogleSheet } from './google-sheet';

it('should append data', async () => {
  const sheetInfo: SheetInfo = {
    id: '12x9yqsk_SHPTUx0SfQhXbw2Ad5JUgfO2BVnPRbBvcuA',
    range: 'Sheet1',
  };

  await expect(
    appendDataToGoogleSheet(configuration.google)(sheetInfo, [['Hello', 'my friend']]),
  ).resolves.toBeUndefined();
});
