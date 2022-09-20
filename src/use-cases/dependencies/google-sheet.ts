import { Maybe } from '@sweet-monads/maybe';

import { SheetInfo } from '../../core/data/sheet';

export type GetSheetInfo = (sequenceId: string) => Maybe<SheetInfo>;
export type SaveInGoogleSheet = (
  sheetInfo: SheetInfo,
  data: Array<Array<Maybe<string>>>,
) => Promise<void>;
