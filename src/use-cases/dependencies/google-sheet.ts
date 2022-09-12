import { SheetInfo } from '../../core/data/sheet';

export type GetSheetInfo = (sequenceId: string) => SheetInfo | undefined;
export type SaveInGoogleSheet = (
  sheetInfo: SheetInfo,
  data: Array<Array<string | undefined>>,
) => Promise<void>;
