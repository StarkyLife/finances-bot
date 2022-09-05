import { saveSequence } from './save-sequence';

it('should save in google sheet', async () => {
  const sheetId = 'sheetId';
  const sequenceData = { type_id: 'Income' };

  const getSequenceData = jest.fn().mockReturnValue(sequenceData);
  const getSheetId = jest.fn().mockReturnValue(sheetId);
  const saveInGoogleSheet = jest.fn();

  await saveSequence(getSequenceData, getSheetId, saveInGoogleSheet);

  expect(saveInGoogleSheet).toHaveBeenCalledWith(sheetId, sequenceData);
});

it('should throw if sequence data is not exist', async () => {
  const getSequenceData = jest.fn().mockReturnValue(undefined);
  const getSheetId = jest.fn();
  const saveInGoogleSheet = jest.fn();

  await expect(
    saveSequence(getSequenceData, getSheetId, saveInGoogleSheet)
  ).rejects.toThrow();
});

it('should throw if sheet id is not found', async () => {
  const getSequenceData = jest.fn().mockReturnValue({});
  const getSheetId = jest.fn().mockReturnValue(undefined);
  const saveInGoogleSheet = jest.fn();

  await expect(
    saveSequence(getSequenceData, getSheetId, saveInGoogleSheet)
  ).rejects.toThrow();
});
