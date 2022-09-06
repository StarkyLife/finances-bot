import { Sequence } from '../core/data/sequence';
import { StepWithLabel } from '../core/data/step';
import { initializeSequence } from './initialize-sequence';

const createStepsMap = (data: Array<[string, StepWithLabel]>) => new Map(data);
const createSequences = (data: Array<Sequence>) => data;

it('should throw if sequence is not found', () => {
  const sequences = createSequences([]);
  const stepsMap = createStepsMap([]);

  expect(() => initializeSequence(sequences, stepsMap)('income-sequence')).toThrow();
});

it("should throw if sequence's first step is not found", () => {
  const sequences = createSequences([{ id: 'income-sequence', firstStepId: 'random' }]);
  const stepsMap = createStepsMap([]);

  expect(() => initializeSequence(sequences, stepsMap)('income-sequence')).toThrow();
});

it('should get first step of chosen sequence', () => {
  const sequenceId = 'income-sequence';
  const stepId = 'price-step-id';
  const stepLabel = 'Price label';

  const sequences = createSequences([{ id: sequenceId, firstStepId: stepId }]);
  const stepsMap = createStepsMap([[stepId, { label: stepLabel }]]);

  const stepInfo = initializeSequence(sequences, stepsMap)('income-sequence');

  expect(stepInfo).toEqual({ id: stepId, label: stepLabel });
});
