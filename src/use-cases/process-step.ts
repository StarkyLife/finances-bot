import { StepWithLabel, StepWithNext } from '../core/data/step';

export const processStep =
  (stepsMap: Map<string, StepWithNext & StepWithLabel>) =>
  (saveStep: (stepId: string, data: string) => void, stepId: string, stepValue: string) => {
    saveStep(stepId, stepValue);

    const nextStepId = stepsMap.get(stepId)?.next;
    const nextStep = nextStepId && stepsMap.get(nextStepId);

    return nextStep && {
      id: nextStepId,
      label: nextStep.label
    };
  };
