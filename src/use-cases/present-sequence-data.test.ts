import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

import { createStepsMap } from '../core/create-steps-map';
import { StepWithSummaryLabel } from '../core/data/step';
import { presentSequenceDataUsecase } from './present-sequence-data';

const createTestStepsMap = (data: Array<[string, StepWithSummaryLabel]>) =>
  createStepsMap(new Map(data));

it('should present sequence data', () => {
  const stepsMap = createTestStepsMap([
    ['type_id', { summaryLabel: 'Type' }],
    ['price_id', { summaryLabel: 'Price' }],
  ]);

  const getSequenceData = jest.fn().mockReturnValue(
    O.some({
      id: 'sequenceId',
      steps: [
        { id: 'type_id', value: 'Income' },
        { id: 'price_id', value: '100' },
        { id: 'comment_id', value: 'comment' },
      ],
    }),
  );

  const sequencePresentation = presentSequenceDataUsecase(stepsMap)(getSequenceData);

  expect(E.toUnion(sequencePresentation)).toEqual([
    { id: 'type_id', label: 'Type', value: 'Income' },
    { id: 'price_id', label: 'Price', value: '100' },
  ]);
});

it('should throw if sequence data is not exist', () => {
  const stepsMap = createTestStepsMap([]);

  const getSequenceData = jest.fn().mockReturnValue(O.none);

  expect(E.isLeft(presentSequenceDataUsecase(stepsMap)(getSequenceData))).toBe(true);
});
