import { StepsMap } from '../core/data/steps-map';
import { processStep } from './process-step';

it('should save step data', () => {
  const stepId = 'step id';
  const stepsMap: StepsMap = new Map([[stepId, undefined]]);
  const data = 'step data';
  const saveStep = jest.fn();

  processStep(stepsMap)(saveStep, stepId, data);

  expect(saveStep).toHaveBeenCalledWith(stepId, data);
});

it('should inform about next step', () => {
  const firstStepId = 'first step id';
  const secondStepId = 'second step id';
  const stepsMap: StepsMap = new Map([
    [firstStepId, secondStepId],
    [secondStepId, undefined],
  ]);
  const saveStep = jest.fn();

  const nextStepId = processStep(stepsMap)(saveStep, firstStepId, 'step data');

  expect(nextStepId).toEqual(secondStepId);
});

it('should inform about end of sequence', () => {
  const stepId = 'step id';
  const stepsMap: StepsMap = new Map([[stepId, undefined]]);
  const saveStep = jest.fn();

  const nextStepId = processStep(stepsMap)(saveStep, stepId, 'step data');

  expect(nextStepId).toBeUndefined();
});
