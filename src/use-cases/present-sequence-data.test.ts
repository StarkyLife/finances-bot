import { just, none } from '@sweet-monads/maybe';

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
    just({
      id: 'sequenceId',
      steps: [
        { id: 'type_id', value: 'Income' },
        { id: 'price_id', value: '100' },
        { id: 'comment_id', value: 'comment' },
      ],
    }),
  );

  const sequencePresentation = presentSequenceDataUsecase(stepsMap)(getSequenceData);

  expect(sequencePresentation).toEqual([
    { id: 'type_id', label: 'Type', value: 'Income' },
    { id: 'price_id', label: 'Price', value: '100' },
  ]);
});

it('should throw if sequence data is not exist', () => {
  const stepsMap = createTestStepsMap([]);

  const getSequenceData = jest.fn().mockReturnValue(none());

  expect(() => presentSequenceDataUsecase(stepsMap)(getSequenceData)).toThrow();
});
