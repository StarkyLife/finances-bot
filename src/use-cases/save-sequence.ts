import { StoredStep } from '../core/data/step';

export const saveSequence = async (
  getSequenceData: () => StoredStep[],
  clearSequenceData: () => void,
  getSheetId: () => string | undefined,
  saveInGoogleSheet: (sheetId: string, data: StoredStep[]) => Promise<void>,
) => {
  const data = getSequenceData();
  if (!data.length) throw new Error('No data to save!');

  const sheetId = getSheetId();
  if (!sheetId) throw new Error('No sheet id!');

  await saveInGoogleSheet(sheetId, data);

  clearSequenceData();
};
