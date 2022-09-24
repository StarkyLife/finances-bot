import * as E from 'fp-ts/Either';
import { constVoid } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

import { createStepsMap } from '../core/create-steps-map';
import { SheetInfo } from '../core/data/sheet';
import { StepWithTransformer } from '../core/data/step';
import { saveSequenceUsecase } from './save-sequence';

const createTestStepsMap = (data: Array<[string, StepWithTransformer]>) =>
  createStepsMap(new Map(data));

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
  const stepsMap = createTestStepsMap([
    ['type_id', { transformer: O.none }],
    ['transform_step_id', { transformer: O.some((value) => value + ' transformed') }],
  ]);

  const getSequenceData = jest.fn().mockReturnValue(O.some(sequenceData));
  const getSheetInfo = jest.fn().mockReturnValue(O.some(sheetInfo));
  const saveInGoogleSheet = jest.fn().mockReturnValue(TE.of(constVoid()));
  const clearSequenceData = jest.fn();

  await saveSequenceUsecase(stepsMap)({
    getSequenceData,
    clearSequenceData,
    getSheetInfo,
    saveInGoogleSheet,
  })();

  expect(saveInGoogleSheet).toHaveBeenCalledWith(sheetInfo, [
    [O.some('Income'), O.some('Value transformed'), O.none],
  ]);
  expect(clearSequenceData).toHaveBeenCalled();
});

it('should throw if sequence data is not exist', async () => {
  const stepsMap = createTestStepsMap([]);

  const getSequenceData = jest.fn().mockReturnValue(O.none);
  const getSheetInfo = jest.fn();
  const saveInGoogleSheet = jest.fn().mockReturnValue(TE.of(constVoid()));
  const clearSequenceData = jest.fn();

  const result = await saveSequenceUsecase(stepsMap)({
    getSequenceData,
    clearSequenceData,
    getSheetInfo,
    saveInGoogleSheet,
  })();

  expect(E.isLeft(result)).toBe(true);
});

it('should throw if sheet id is not found', async () => {
  const stepsMap = createTestStepsMap([]);
  const sequenceData = {
    id: 'sequenceId',
    steps: [{ id: 'type_id', value: 'Income' }],
  };

  const getSequenceData = jest.fn().mockReturnValue(O.some(sequenceData));
  const getSheetInfo = jest.fn().mockReturnValue(O.none);
  const saveInGoogleSheet = jest.fn().mockReturnValue(TE.of(constVoid()));
  const clearSequenceData = jest.fn();

  const result = await saveSequenceUsecase(stepsMap)({
    getSequenceData,
    clearSequenceData,
    getSheetInfo,
    saveInGoogleSheet,
  })();

  expect(E.isLeft(result)).toBe(true);
});
