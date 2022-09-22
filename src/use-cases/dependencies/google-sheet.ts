import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

import { SheetInfo } from '../../core/data/sheet';

export type GetSheetInfo = (sequenceId: string) => O.Option<SheetInfo>;
export type SaveInGoogleSheet = (
  sheetInfo: SheetInfo,
  data: Array<Array<O.Option<string>>>,
) => TE.TaskEither<Error, void>;
