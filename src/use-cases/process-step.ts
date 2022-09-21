import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

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
  ): E.Either<Error, O.Option<StepUI>> => {
    const getNextStep = (stepId: string) =>
      pipe(
        stepsMap.getBy(stepId),
        O.chain((s) => {
          rememberCurrentStep(s.next);
          return s.next;
        }),
        O.chain((nextStepId: string) =>
          pipe(
            stepsMap.getBy(nextStepId),
            O.map(
              ({ label, staticChoices }): StepUI => ({
                id: nextStepId,
                label,
                choices: staticChoices,
              }),
            ),
          ),
        ),
      );

    return pipe(
      getCurrentStep(),
      E.fromOption(() => new Error('Current step is not found!')),
      E.chain((stepId) => pipe(saveStep(stepId, stepValue), E.map(getNextStep.bind(null, stepId)))),
    );
  };
