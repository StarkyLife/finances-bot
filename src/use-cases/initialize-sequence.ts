import { SequenceWithName, SequenceWithFirstStepId, SequenceWithId } from '../core/data/sequence';
import { StepUI, StepWithLabel, StepWithStaticChoices } from '../core/data/step';

export const initializeSequenceUsecase =
  (
    sequences: Array<SequenceWithId & SequenceWithName & SequenceWithFirstStepId>,
    stepsMap: Map<string, StepWithLabel & StepWithStaticChoices>,
  ) =>
  (
    rememberCurrentStep: (stepId: string) => void,
    createSequenceData: (sequenceId: string) => void,
    sequenceName: string
  ): StepUI => {
    const sequence = sequences.find(({ name }) => name === sequenceName);

    if (!sequence) throw new Error(`${sequenceName} sequence is not found!`);

    const stepId = sequence.firstStepId;
    const stepInfo = stepsMap.get(stepId);

    if (!stepInfo) throw new Error(`Step ${stepId} is not found!`);

    rememberCurrentStep(stepId);
    createSequenceData(sequence.id);

    return {
      id: stepId,
      label: stepInfo.label,
      choices: stepInfo.staticChoices,
    };
  };
