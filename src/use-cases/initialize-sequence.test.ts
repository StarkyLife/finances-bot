import { just } from '@sweet-monads/maybe';

import { createStepsMap } from '../core/create-steps-map';
import { SequenceWithFirstStepId, SequenceWithId, SequenceWithName } from '../core/data/sequence';
import { StepWithLabel, StepWithStaticChoices } from '../core/data/step';
import { initializeSequenceUsecase } from './initialize-sequence';

const createTestStepsMap = (data: Array<[string, StepWithLabel & StepWithStaticChoices]>) =>
  createStepsMap(new Map(data));
const createSequences = (
  data: Array<SequenceWithId & SequenceWithName & SequenceWithFirstStepId>,
) => data;

it('should throw if sequence is not found', () => {
  const sequences = createSequences([]);
  const stepsMap = createTestStepsMap([]);
  const rememberCurrentStep = jest.fn();
  const createSequenceData = jest.fn();

  expect(
    initializeSequenceUsecase(sequences, stepsMap)(
      rememberCurrentStep,
      createSequenceData,
      'Income sequence name',
    ).isLeft(),
  ).toBe(true);
});

it("should throw if sequence's first step is not found", () => {
  const sequences = createSequences([
    {
      id: 'sequenceId',
      name: 'Income sequence name',
      firstStepId: 'random',
    },
  ]);
  const stepsMap = createTestStepsMap([]);
  const rememberCurrentStep = jest.fn();
  const createSequenceData = jest.fn();

  expect(
    initializeSequenceUsecase(sequences, stepsMap)(
      rememberCurrentStep,
      createSequenceData,
      'Income sequence name',
    ).isLeft(),
  ).toBe(true);
});

it('should get first step of chosen sequence and remember as current', () => {
  const stepId = 'price-step-id';
  const stepLabel = 'Price label';
  const sequenceId = 'income_sequence';
  const sequences = createSequences([
    {
      id: sequenceId,
      name: 'Income sequence name',
      firstStepId: stepId,
    },
  ]);
  const stepsMap = createTestStepsMap([[stepId, { label: stepLabel, staticChoices: ['choice1'] }]]);
  const rememberCurrentStep = jest.fn();
  const createSequenceData = jest.fn();

  const stepInfo = initializeSequenceUsecase(sequences, stepsMap)(
    rememberCurrentStep,
    createSequenceData,
    'Income sequence name',
  );

  expect(stepInfo.unwrap()).toEqual({ id: stepId, label: stepLabel, choices: ['choice1'] });
  expect(rememberCurrentStep).toHaveBeenCalledWith(just(stepId));
  expect(createSequenceData).toHaveBeenCalledWith(sequenceId);
});
