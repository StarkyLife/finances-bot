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
  ): E.Either<Error, O.Option<StepUI>> =>
    pipe(
      getCurrentStep(),
      E.fromOption(() => new Error('Current step is not found!')),
      E.chainFirst((stepId) => saveStep(stepId, stepValue)),
      E.map((stepId) =>
        pipe(
          stepsMap.getBy(stepId),
          O.bind('nextStepId', (s) => {
            rememberCurrentStep(s.next);
            return s.next;
          }),
          O.bind('nextStep', ({ nextStepId }) => stepsMap.getBy(nextStepId)),
          O.map(
            ({ nextStepId, nextStep }): StepUI => ({
              id: nextStepId,
              label: nextStep.label,
              choices: nextStep.staticChoices,
            }),
          ),
        ),
      ),
    );
