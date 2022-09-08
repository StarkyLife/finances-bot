import { StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';
import { processStep } from './process-step';

const createStepsMap = (
  data: Array<[string, StepWithNext & StepWithLabel & StepWithStaticChoices]>,
) => new Map(data);

it('should fail if current step is not found', () => {
  const stepsMap = createStepsMap([]);
  const stepValue = 'step data';
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(undefined);
  const rememberCurrentStep = jest.fn();

  expect(() =>
    processStep(stepsMap)(getCurrentStep, rememberCurrentStep, saveStep, stepValue),
  ).toThrow();
});

it('should save step data', () => {
  const currentStepId = 'step id';
  const stepsMap = createStepsMap([[currentStepId, { label: 'step label', next: undefined }]]);
  const stepValue = 'step data';
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(currentStepId);
  const rememberCurrentStep = jest.fn();

  processStep(stepsMap)(getCurrentStep, rememberCurrentStep, saveStep, stepValue);

  expect(saveStep).toHaveBeenCalledWith(currentStepId, stepValue);
});

it('should inform about next step and remember it', () => {
  const currentStepId = 'first step id';
  const nextStepId = 'second step id';
  const stepsMap = createStepsMap([
    [currentStepId, { label: 'first label', next: nextStepId }],
    [nextStepId, { label: 'second label', staticChoices: ['choice1'], next: undefined }],
  ]);
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(currentStepId);
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStep(stepsMap)(
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
  expect(rememberCurrentStep).toHaveBeenCalledWith(nextStepId);
});

it('should inform about end of sequence and remember it', () => {
  const currentStepId = 'step id';
  const stepsMap = createStepsMap([[currentStepId, { label: 'step label', next: undefined }]]);
  const saveStep = jest.fn();
  const getCurrentStep = jest.fn().mockReturnValue(currentStepId);
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStep(stepsMap)(
    getCurrentStep,
    rememberCurrentStep,
    saveStep,
    'step data',
  );

  expect(nextStepInfo).toBeUndefined();
  expect(rememberCurrentStep).toHaveBeenCalledWith(undefined);
});
