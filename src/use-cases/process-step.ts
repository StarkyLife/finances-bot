import { StepUI, StepWithLabel, StepWithNext, StepWithStaticChoices } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { GetCurrentStep, RememberCurrentStep } from './dependencies/current-step';
import { SaveStep } from './dependencies/sequence-data';

export const processStepUsecase =
  (stepsMap: StepsMap<StepWithNext & StepWithLabel & StepWithStaticChoices>) =>
  (
    getCurrentStep: GetCurrentStep,
    rememberCurrentStep: RememberCurrentStep,
    saveStep: SaveStep,
    stepValue: string,
  ): StepUI | undefined => {
    const stepId = getCurrentStep();
    if (stepId.isNone()) throw new Error('Current step is not found!');

    saveStep(stepId.value, stepValue);

    const nextStepId = stepsMap.getBy(stepId.value).chain((s) => s.next);

    rememberCurrentStep(nextStepId);

    const nextStep = nextStepId.chain((id) =>
      stepsMap.getBy(id).map(({ label, staticChoices }) => ({
        id,
        label,
        choices: staticChoices,
      })),
    );

    return nextStep.value;
  };
