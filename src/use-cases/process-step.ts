import { just, Maybe } from '@sweet-monads/maybe';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';

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
  ): E.Either<Error, Maybe<StepUI>> => {
    const createStepUI = (nextStepId: string) =>
      stepsMap.getBy(nextStepId).map(
        ({ label, staticChoices }): StepUI => ({
          id: nextStepId,
          label,
          choices: staticChoices,
        }),
      );

    const getNextStep = (stepId: string) =>
      stepsMap
        .getBy(stepId)
        .chain((s) => {
          rememberCurrentStep(s.next);
          return s.next;
        })
        .chain(createStepUI);

    return getCurrentStep()
      .map((stepId) => pipe(saveStep(stepId, stepValue), E.map(getNextStep.bind(null, stepId))))
      .or(just(E.left(new Error('Current step is not found!'))))
      .unwrap();
  };
