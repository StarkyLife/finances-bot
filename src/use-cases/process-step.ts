import { StepUI, StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';

export const processStep =
  (stepsMap: Map<string, StepWithNext & StepWithLabel & StepWithStaticChoices>) =>
  (
    saveStep: (stepId: string, data: string) => void,
    stepId: string,
    stepValue: string,
  ): StepUI | undefined => {
    saveStep(stepId, stepValue);

    const nextStepId = stepsMap.get(stepId)?.next;
    const nextStep = nextStepId && stepsMap.get(nextStepId);

    return nextStep
      ? {
          id: nextStepId,
          label: nextStep.label,
          choices: nextStep.staticChoices,
        }
      : undefined;
  };
