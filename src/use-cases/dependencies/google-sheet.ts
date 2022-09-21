import * as O from 'fp-ts/Option';

import { SheetInfo } from '../../core/data/sheet';

export type GetSheetInfo = (sequenceId: string) => O.Option<SheetInfo>;
export type SaveInGoogleSheet = (
  sheetInfo: SheetInfo,
  data: Array<Array<O.Option<string>>>,
) => Promise<void>;
