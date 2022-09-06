import { SheetInfo } from '../core/data/sheet';
import { saveSequence } from './save-sequence';

it('should save data in google sheet and clear', async () => {
  const sheetInfo: SheetInfo = { id: 'sheetId', range: 'range' };
  const sequenceData = [{ id: 'type_id', value: 'Income' }];

  const getSequenceData = jest.fn().mockReturnValue(sequenceData);
  const getSheetInfo = jest.fn().mockReturnValue(sheetInfo);
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await saveSequence({ getSequenceData, clearSequenceData, getSheetInfo, saveInGoogleSheet });

  expect(saveInGoogleSheet).toHaveBeenCalledWith(sheetInfo, [['Income']]);
  expect(clearSequenceData).toHaveBeenCalled();
});

it('should throw if sequence data is not exist', async () => {
  const getSequenceData = jest.fn().mockReturnValue([]);
  const getSheetInfo = jest.fn();
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await expect(
    saveSequence({ getSequenceData, clearSequenceData, getSheetInfo, saveInGoogleSheet }),
  ).rejects.toThrow();
});

it('should throw if sheet id is not found', async () => {
  const sequenceData = [{ id: 'type_id', value: 'Income' }];

  const getSequenceData = jest.fn().mockReturnValue(sequenceData);
  const getSheetInfo = jest.fn().mockReturnValue(undefined);
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await expect(
    saveSequence({ getSequenceData, clearSequenceData, getSheetInfo, saveInGoogleSheet }),
  ).rejects.toThrow();
});
