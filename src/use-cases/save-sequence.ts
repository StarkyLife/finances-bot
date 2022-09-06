import { SheetInfo } from '../core/data/sheet';
import { StoredStep } from '../core/data/step';

export const saveSequence = async (deps: {
  getSequenceData: () => StoredStep[];
  clearSequenceData: () => void;
  getSheetInfo: () => SheetInfo | undefined;
  saveInGoogleSheet: (
    sheetInfo: SheetInfo,
    data: Array<Array<string | undefined>>,
  ) => Promise<void>;
}) => {
  const data = deps.getSequenceData();
  if (!data.length) throw new Error('No data to save!');

  const sheetInfo = deps.getSheetInfo();
  if (!sheetInfo) throw new Error('No sheet id!');

  await deps.saveInGoogleSheet(sheetInfo, [data.map((i) => i.value)]);

  deps.clearSequenceData();
};
