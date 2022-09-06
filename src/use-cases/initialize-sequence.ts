import { Sequence } from '../core/data/sequence';
import { StepWithLabel } from '../core/data/step';

export const initializeSequence =
  (sequences: Sequence[], stepsMap: Map<string, StepWithLabel>) => (sequenceId: string) => {
    const sequence = sequences.find(({ id }) => id === sequenceId);

    if (!sequence) throw new Error(`${sequenceId} sequence is not found!`);

    const stepId = sequence.firstStepId;
    const stepInfo = stepsMap.get(stepId);

    if (!stepInfo) throw new Error(`Step ${stepId} is not found!`);

    return {
      id: stepId,
      label: stepInfo.label,
    };
  };
