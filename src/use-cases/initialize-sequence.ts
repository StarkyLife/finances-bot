import { just } from '@sweet-monads/maybe';

import { SequenceWithFirstStepId, SequenceWithId, SequenceWithName } from '../core/data/sequence';
import { StepUI, StepWithLabel, StepWithStaticChoices } from '../core/data/step';
import { RememberCurrentStep } from './dependencies/current-step';
import { CreateSequenceData } from './dependencies/sequence-data';

export const initializeSequenceUsecase =
  (
    sequences: Array<SequenceWithId & SequenceWithName & SequenceWithFirstStepId>,
    stepsMap: Map<string, StepWithLabel & StepWithStaticChoices>,
  ) =>
  (
    rememberCurrentStep: RememberCurrentStep,
    createSequenceData: CreateSequenceData,
    sequenceName: string,
  ): StepUI => {
    const sequence = sequences.find(({ name }) => name === sequenceName);

    if (!sequence) throw new Error(`${sequenceName} sequence is not found!`);

    const stepId = sequence.firstStepId;
    const stepInfo = stepsMap.get(stepId);

    if (!stepInfo) throw new Error(`Step ${stepId} is not found!`);

    rememberCurrentStep(just(stepId));
    createSequenceData(sequence.id);

    return {
      id: stepId,
      label: stepInfo.label,
      choices: stepInfo.staticChoices,
    };
  };
