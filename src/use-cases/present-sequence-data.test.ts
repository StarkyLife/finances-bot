import { StepWithLabel } from '../core/data/step';
import { presentSequenceData } from './present-sequence-data';

const createStepsMap = (data: Array<[string, StepWithLabel]>) => new Map(data);

it('should present sequence data', () => {
  const stepsMap = createStepsMap([
    ['type_id', { label: 'Type' }],
    ['price_id', { label: 'Price' }],
  ]);

  const getSequenceData = jest.fn().mockReturnValue({
    type_id: 'Income',
    price_id: '100',
    comment_id: 'comment',
  });

  const sequencePresentation = presentSequenceData(stepsMap)(getSequenceData);

  expect(sequencePresentation).toEqual([
    { id: 'type_id', label: 'Type', value: 'Income' },
    { id: 'price_id', label: 'Price', value: '100' },
  ]);
});

it('should throw if sequence data is not exist', () => {
  const stepsMap = createStepsMap([]);

  const getSequenceData = jest.fn().mockReturnValue(undefined);

  expect(() => presentSequenceData(stepsMap)(getSequenceData)).toThrow();
});
