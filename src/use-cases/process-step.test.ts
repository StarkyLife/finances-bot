import { StepWithLabel, StepWithNext } from '../core/data/step';
import { processStep } from './process-step';

const createStepsMap = (data: Array<[string, StepWithNext & StepWithLabel]>) => new Map(data);

it('should save step data', () => {
  const stepId = 'step id';
  const stepsMap = createStepsMap([[stepId, { label: 'step label', next: undefined }]]);
  const stepValue = 'step data';
  const saveStep = jest.fn();

  processStep(stepsMap)(saveStep, stepId, stepValue);

  expect(saveStep).toHaveBeenCalledWith(stepId, stepValue);
});

it('should inform about next step', () => {
  const firstStepId = 'first step id';
  const secondStepId = 'second step id';
  const stepsMap = createStepsMap([
    [firstStepId, { label: 'first label', next: secondStepId }],
    [secondStepId, { label: 'second label', next: undefined }],
  ]);
  const saveStep = jest.fn();

  const nextStepInfo = processStep(stepsMap)(saveStep, firstStepId, 'step data');

  expect(nextStepInfo).toEqual({
    id: secondStepId,
    label: 'second label',
  });
});

it('should inform about end of sequence', () => {
  const stepId = 'step id';
  const stepsMap = createStepsMap([[stepId, { label: 'step label', next: undefined }]]);
  const saveStep = jest.fn();

  const nextStepInfo = processStep(stepsMap)(saveStep, stepId, 'step data');

  expect(nextStepInfo).toBeUndefined();
});
