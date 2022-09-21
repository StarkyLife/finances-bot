import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { createStepsMap } from '../core/create-steps-map';
import { StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';
import { processStepUsecase } from './process-step';

const createTestStepsMap = (
  data: Array<[string, StepWithNext & StepWithLabel & StepWithStaticChoices]>,
) => createStepsMap(new Map(data));

it('should fail if current step is not found', () => {
  const stepsMap = createTestStepsMap([]);
  const stepValue = 'step data';
  const saveStep = jest.fn().mockReturnValue(E.right(undefined));
  const getCurrentStep = jest.fn().mockReturnValue(O.none);
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStepUsecase(stepsMap)(
    getCurrentStep,
    rememberCurrentStep,
    saveStep,
    stepValue,
  );

  expect(E.isLeft(nextStepInfo)).toBe(true);
});

it('should save step data', () => {
  const currentStepId = 'step id';
  const stepsMap = createTestStepsMap([[currentStepId, { label: 'step label', next: O.none }]]);
  const stepValue = 'step data';
  const saveStep = jest.fn().mockReturnValue(E.right(undefined));
  const getCurrentStep = jest.fn().mockReturnValue(O.some(currentStepId));
  const rememberCurrentStep = jest.fn();

  processStepUsecase(stepsMap)(getCurrentStep, rememberCurrentStep, saveStep, stepValue);

  expect(saveStep).toHaveBeenCalledWith(currentStepId, stepValue);
});

it('should inform about next step and remember it', () => {
  const currentStepId = 'first step id';
  const nextStepId = 'second step id';
  const stepsMap = createTestStepsMap([
    [currentStepId, { label: 'first label', next: O.some(nextStepId) }],
    [nextStepId, { label: 'second label', staticChoices: ['choice1'], next: O.none }],
  ]);
  const saveStep = jest.fn().mockReturnValue(E.right(undefined));
  const getCurrentStep = jest.fn().mockReturnValue(O.some(currentStepId));
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStepUsecase(stepsMap)(
    getCurrentStep,
    rememberCurrentStep,
    saveStep,
    'step data',
  );

  expect(pipe(nextStepInfo, E.chain(E.fromOption(() => new Error())), E.toUnion)).toEqual({
    id: nextStepId,
    label: 'second label',
    choices: ['choice1'],
  });
  expect(rememberCurrentStep).toHaveBeenCalledWith(O.some(nextStepId));
});

it('should inform about end of sequence and remember it', () => {
  const currentStepId = 'step id';
  const stepsMap = createTestStepsMap([[currentStepId, { label: 'step label', next: O.none }]]);
  const saveStep = jest.fn().mockReturnValue(E.right(undefined));
  const getCurrentStep = jest.fn().mockReturnValue(O.some(currentStepId));
  const rememberCurrentStep = jest.fn();

  const nextStepInfo = processStepUsecase(stepsMap)(
    getCurrentStep,
    rememberCurrentStep,
    saveStep,
    'step data',
  );

  expect(
    pipe(
      nextStepInfo,
      E.map((s) => O.isNone(s)),
      E.toUnion,
    ),
  ).toBe(true);
  expect(rememberCurrentStep).toHaveBeenCalledWith(O.none);
});
