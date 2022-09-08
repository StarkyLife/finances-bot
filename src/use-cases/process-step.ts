import { StepUI, StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';

export const processStep =
  (stepsMap: Map<string, StepWithNext & StepWithLabel & StepWithStaticChoices>) =>
  (
    getCurrentStep: () => string | undefined,
    rememberCurrentStep: (stepId: string | undefined) => void,
    saveStep: (stepId: string, data: string) => void,
    stepValue: string,
  ): StepUI | undefined => {
    const stepId = getCurrentStep();
    if (!stepId) throw new Error('Current step is not found!');

    saveStep(stepId, stepValue);

    const nextStepId = stepsMap.get(stepId)?.next;
    const nextStep = nextStepId && stepsMap.get(nextStepId);

    rememberCurrentStep(nextStepId);

    return nextStep
      ? {
          id: nextStepId,
          label: nextStep.label,
          choices: nextStep.staticChoices,
        }
      : undefined;
  };
