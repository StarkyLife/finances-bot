import { Sequence } from './data/sequence';
import { SequenceDescription } from './data/sequence-description';
import { Step } from './data/step';

export const configureSequences = (
  descriptions: SequenceDescription[],
): { sequences: Sequence[]; stepsMap: Map<string, Step> } => {
  if (!descriptions.length) throw new Error('No sequences!');

  const stepsMap = new Map<string, Step>();

  const sequences = descriptions.map((sequenceDescription) => {
    if (!sequenceDescription.steps.length)
      throw new Error(`Sequence ${sequenceDescription.id} has no steps!`);

    const stepsConnectedToSequence = sequenceDescription.steps.map(({ id, config }) => ({
      id: `${sequenceDescription.id}_${id}`,
      config,
    }));

    stepsConnectedToSequence.reverse().reduce((prevStepId: string | undefined, current) => {
      stepsMap.set(current.id, {
        ...current.config,
        next: prevStepId,
      });

      return current.id;
    }, undefined);

    return {
      name: sequenceDescription.name,
      firstStepId: stepsConnectedToSequence[0].id,
    };
  });

  return { sequences, stepsMap };
};
