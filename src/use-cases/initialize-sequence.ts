import { Either, left, right } from '@sweet-monads/either';
import { just } from '@sweet-monads/maybe';

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
  ): Either<Error, StepUI> => {
    const sequence = sequences.find(({ name }) => name === sequenceName);

    if (!sequence) return left(new Error(`${sequenceName} sequence is not found!`));

    const stepId = sequence.firstStepId;

    return stepsMap
      .getBy(stepId)
      .map((s) => ({
        id: stepId,
        label: s.label,
        choices: s.staticChoices,
      }))
      .map((stepInfo) => {
        rememberCurrentStep(just(stepInfo.id));
        createSequenceData(sequence.id);
        return stepInfo;
      })
      .map((s) => right<Error, StepUI>(s))
      .or(just(left(new Error(`Step ${stepId} is not found!`))))
      .unwrap();
  };
