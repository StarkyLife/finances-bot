import { just, none } from '@sweet-monads/maybe';

import { SheetInfo } from '../core/data/sheet';
import { StepWithTransformer } from '../core/data/step';
import { saveSequenceUsecase } from './save-sequence';

const createStepsMap = (data: Array<[string, StepWithTransformer]>) => new Map(data);

it('should save data in google sheet and clear', async () => {
  const sheetInfo: SheetInfo = { id: 'sheetId', range: 'range' };
  const sequenceData = {
    id: 'sequenceId',
    steps: [
      { id: 'type_id', value: 'Income' },
      { id: 'transform_step_id', value: 'Value' },
      { id: 'non_existent_step_id', value: 'Not exists value' },
    ],
  };
  const stepsMap = createStepsMap([
    ['type_id', {}],
    ['transform_step_id', { transformer: (value) => value + ' transformed' }],
  ]);

  const getSequenceData = jest.fn().mockReturnValue(just(sequenceData));
  const getSheetInfo = jest.fn().mockReturnValue(just(sheetInfo));
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await saveSequenceUsecase(stepsMap)({
    getSequenceData,
    clearSequenceData,
    getSheetInfo,
    saveInGoogleSheet,
  });

  expect(saveInGoogleSheet).toHaveBeenCalledWith(sheetInfo, [
    [just('Income'), just('Value transformed'), none()],
  ]);
  expect(clearSequenceData).toHaveBeenCalled();
});

it('should throw if sequence data is not exist', async () => {
  const stepsMap = createStepsMap([]);

  const getSequenceData = jest.fn().mockReturnValue(none());
  const getSheetInfo = jest.fn();
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await expect(
    saveSequenceUsecase(stepsMap)({
      getSequenceData,
      clearSequenceData,
      getSheetInfo,
      saveInGoogleSheet,
    }),
  ).rejects.toThrow();
});

it('should throw if sheet id is not found', async () => {
  const stepsMap = createStepsMap([]);
  const sequenceData = {
    id: 'sequenceId',
    steps: [{ id: 'type_id', value: 'Income' }],
  };

  const getSequenceData = jest.fn().mockReturnValue(just(sequenceData));
  const getSheetInfo = jest.fn().mockReturnValue(none());
  const saveInGoogleSheet = jest.fn();
  const clearSequenceData = jest.fn();

  await expect(
    saveSequenceUsecase(stepsMap)({
      getSequenceData,
      clearSequenceData,
      getSheetInfo,
      saveInGoogleSheet,
    }),
  ).rejects.toThrow();
});
