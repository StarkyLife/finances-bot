import { SequenceWithFirstStepId, SequenceWithName } from '../core/data/sequence';
import { StepWithLabel, StepWithStaticChoices } from '../core/data/step';
import { initializeSequenceUsecase } from './initialize-sequence';

const createStepsMap = (data: Array<[string, StepWithLabel & StepWithStaticChoices]>) =>
  new Map(data);
const createSequences = (data: Array<SequenceWithName & SequenceWithFirstStepId>) => data;

it('should throw if sequence is not found', () => {
  const sequences = createSequences([]);
  const stepsMap = createStepsMap([]);

  expect(() => initializeSequenceUsecase(sequences, stepsMap)('Income sequence name')).toThrow();
});

it("should throw if sequence's first step is not found", () => {
  const sequences = createSequences([
    {
      name: 'Income sequence name',
      firstStepId: 'random',
    },
  ]);
  const stepsMap = createStepsMap([]);

  expect(() => initializeSequenceUsecase(sequences, stepsMap)('Income sequence name')).toThrow();
});

it('should get first step of chosen sequence', () => {
  const stepId = 'price-step-id';
  const stepLabel = 'Price label';

  const sequences = createSequences([
    {
      name: 'Income sequence name',
      firstStepId: stepId,
    },
  ]);
  const stepsMap = createStepsMap([[stepId, { label: stepLabel, staticChoices: ['choice1'] }]]);

  const stepInfo = initializeSequenceUsecase(sequences, stepsMap)('Income sequence name');

  expect(stepInfo).toEqual({ id: stepId, label: stepLabel, choices: ['choice1'] });
});
