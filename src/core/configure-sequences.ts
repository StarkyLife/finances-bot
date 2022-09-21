import * as O from 'fp-ts/Option';

import { createStepsMap, RealStepsMap } from './create-steps-map';
import { Sequence } from './data/sequence';
import { SequenceDescription } from './data/sequence-description';
import { Step } from './data/step';

export const configureSequences = (
  descriptions: SequenceDescription[],
): { sequences: Sequence[]; stepsMap: RealStepsMap<Step> } => {
  if (!descriptions.length) throw new Error('No sequences!');

  const stepsMapData = new Map<string, Step>();

  const sequences = descriptions.map((sequenceDescription) => {
    if (!sequenceDescription.steps.length)
      throw new Error(`Sequence ${sequenceDescription.id} has no steps!`);

    const stepsWithModifiedId = sequenceDescription.steps.map((step) => ({
      ...step,
      id: `${sequenceDescription.id}_${step.id}`,
    }));

    stepsWithModifiedId.reduceRight(
      (prevStepId: string | undefined, current) =>
        stepsMapData.set(current.id, { ...current.config, next: O.fromNullable(prevStepId) }) &&
        current.id,
      undefined,
    );

    return {
      id: sequenceDescription.id,
      name: sequenceDescription.name,
      firstStepId: stepsWithModifiedId[0].id,
    };
  });

  return { sequences, stepsMap: createStepsMap(stepsMapData) };
};
