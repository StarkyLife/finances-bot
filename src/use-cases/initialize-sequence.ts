import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { SequenceWithFirstStepId, SequenceWithId, SequenceWithName } from '../core/data/sequence';
import { StepUI, StepWithLabel, StepWithStaticChoices } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { RememberCurrentStep } from './dependencies/current-step';
import { CreateSequenceData } from './dependencies/sequence-data';

export const initializeSequenceUsecase =
  (
    sequences: Array<SequenceWithId & SequenceWithName & SequenceWithFirstStepId>,
    stepsMap: StepsMap<StepWithLabel & StepWithStaticChoices>,
  ) =>
  (
    rememberCurrentStep: RememberCurrentStep,
    createSequenceData: CreateSequenceData,
    sequenceName: string,
  ): E.Either<Error, StepUI> =>
    pipe(
      sequences.find(({ name }) => name === sequenceName),
      E.fromNullable(new Error(`${sequenceName} sequence is not found!`)),
      E.chain((sequence) =>
        pipe(
          stepsMap.getBy(sequence.firstStepId),
          E.fromOption(() => new Error(`Step ${sequence.firstStepId} is not found!`)),
          E.map((s) => ({
            id: sequence.firstStepId,
            label: s.label,
            choices: s.staticChoices,
          })),
          E.map((stepInfo) => {
            rememberCurrentStep(O.some(stepInfo.id));
            createSequenceData(sequence.id);
            return stepInfo;
          }),
        ),
      ),
    );
