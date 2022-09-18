import { Either, left } from '@sweet-monads/either';
import { just, Maybe } from '@sweet-monads/maybe';

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
  ): Either<Error, Maybe<StepUI>> => {
    const createStepUI = (nextStepId: string) =>
      stepsMap.getBy(nextStepId).map(({ label, staticChoices }) => ({
        id: nextStepId,
        label,
        choices: staticChoices,
      }));

    const getNextStep = (stepId: string) =>
      stepsMap
        .getBy(stepId)
        .chain((s) => {
          rememberCurrentStep(s.next);
          return s.next;
        })
        .chain(createStepUI);

    return getCurrentStep()
      .map((stepId) => saveStep(stepId, stepValue).map(getNextStep.bind(null, stepId)))
      .or(just(left(new Error('Current step is not found!'))))
      .unwrap();
  };
