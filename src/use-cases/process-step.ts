import { fromNullable } from '@sweet-monads/maybe';

import { StepUI, StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';
import { GetCurrentStep, RememberCurrentStep } from './dependencies/current-step';
import { SaveStep } from './dependencies/sequence-data';

export const processStepUsecase =
  (stepsMap: Map<string, StepWithNext & StepWithLabel & StepWithStaticChoices>) =>
  (
    getCurrentStep: GetCurrentStep,
    rememberCurrentStep: RememberCurrentStep,
    saveStep: SaveStep,
    stepValue: string,
  ): StepUI | undefined => {
    const stepId = getCurrentStep();
    if (stepId.isNone()) throw new Error('Current step is not found!');

    saveStep(stepId.value, stepValue);

    const nextStepId = stepsMap.get(stepId.value)?.next;
    const nextStep = nextStepId && stepsMap.get(nextStepId);

    rememberCurrentStep(fromNullable(nextStepId));

    return nextStep
      ? {
          id: nextStepId,
          label: nextStep.label,
          choices: nextStep.staticChoices,
        }
      : undefined;
  };
