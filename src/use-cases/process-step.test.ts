import { just, none } from '@sweet-monads/maybe';

import { createStepsMap } from '../core/create-steps-map';
import { StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';
import { processStepUsecase } from './process-step';

const createTestStepsMap = (
  data: Array<[string, StepWithNext & StepWithLabel & StepWithStaticChoices]>,
) => createStepsMap(new Map(data));

it('should fail if current step is not found', () => {
  const stepsMap = createTestStepsMap([]);
  const stepValue = 'step data';
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(none());
  const rememberCurrentStep = jest.fn();

  expect(() =>
    processStepUsecase(stepsMap)(getCurrentStep, rememberCurrentStep, saveStep, stepValue),
  ).toThrow();
});

it('should save step data', () => {
  const currentStepId = 'step id';
  const stepsMap = createTestStepsMap([[currentStepId, { label: 'step label', next: none() }]]);
  const stepValue = 'step data';
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(just(currentStepId));
  const rememberCurrentStep = jest.fn();

  processStepUsecase(stepsMap)(getCurrentStep, rememberCurrentStep, saveStep, stepValue);

  expect(saveStep).toHaveBeenCalledWith(currentStepId, stepValue);
});

it('should inform about next step and remember it', () => {
  const currentStepId = 'first step id';
  const nextStepId = 'second step id';
  const stepsMap = createTestStepsMap([
    [currentStepId, { label: 'first label', next: just(nextStepId) }],
    [nextStepId, { label: 'second label', staticChoices: ['choice1'], next: none() }],
  ]);
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(just(currentStepId));
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStepUsecase(stepsMap)(
    getCurrentStep,
    rememberCurrentStep,
    saveStep,
    'step data',
  );

  expect(nextStepInfo).toEqual({
    id: nextStepId,
    label: 'second label',
    choices: ['choice1'],
  });
  expect(rememberCurrentStep).toHaveBeenCalledWith(just(nextStepId));
});

it('should inform about end of sequence and remember it', () => {
  const currentStepId = 'step id';
  const stepsMap = createTestStepsMap([[currentStepId, { label: 'step label', next: none() }]]);
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(just(currentStepId));
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStepUsecase(stepsMap)(
    getCurrentStep,
    rememberCurrentStep,
    saveStep,
    'step data',
  );

  expect(nextStepInfo).toBeUndefined();
  expect(rememberCurrentStep).toHaveBeenCalledWith(none());
});
