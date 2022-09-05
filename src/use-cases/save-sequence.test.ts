import { saveSequence } from './save-sequence';

it('should save data in google sheet and clear', async () => {
  const sheetId = 'sheetId';
  const sequenceData = { type_id: 'Income' };

  const getSequenceData = jest.fn().mockReturnValue(sequenceData);
  const getSheetId = jest.fn().mockReturnValue(sheetId);
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await saveSequence(getSequenceData, clearSequenceData, getSheetId, saveInGoogleSheet);

  expect(saveInGoogleSheet).toHaveBeenCalledWith(sheetId, sequenceData);
  expect(clearSequenceData).toHaveBeenCalled();
});

it('should throw if sequence data is not exist', async () => {
  const getSequenceData = jest.fn().mockReturnValue(undefined);
  const getSheetId = jest.fn();
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await expect(saveSequence(getSequenceData, clearSequenceData, getSheetId, saveInGoogleSheet)).rejects.toThrow();
});

it('should throw if sheet id is not found', async () => {
  const getSequenceData = jest.fn().mockReturnValue({});
  const getSheetId = jest.fn().mockReturnValue(undefined);
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await expect(saveSequence(getSequenceData, clearSequenceData, getSheetId, saveInGoogleSheet)).rejects.toThrow();
});
