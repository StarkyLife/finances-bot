export const saveSequence = async (
  getSequenceData: () => Record<string, string> | undefined,
  getSheetId: () => string | undefined,
  saveInGoogleSheet: (sheetId: string, data: Record<string, string>) => Promise<void>
) => {
  const data = getSequenceData();
  if (!data) throw new Error('No data to save!');

  const sheetId = getSheetId();
  if (!sheetId) throw new Error('No sheet id!');

  await saveInGoogleSheet(sheetId, data);
};
