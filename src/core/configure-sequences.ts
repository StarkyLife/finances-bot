import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { createStepsMap, RealStepsMap } from './create-steps-map';
import { Sequence } from './data/sequence';
import { SequenceDescription } from './data/sequence-description';
import { Step } from './data/step';

type IntermediateStep = { id: string; data: Step };
type IntermediateSequencesData = { sequences: Sequence[]; steps: IntermediateStep[] };
type ResultSequenceData = { sequences: Sequence[]; stepsMap: RealStepsMap<Step> };

export const configureSequences = (descriptions: SequenceDescription[]) =>
  pipe(
    descriptions,
    A.filterMap((sequenceDescription) =>
      pipe(
        sequenceDescription.steps,
        A.reduceRight([], (current, stepsMapData: Array<IntermediateStep>) =>
          pipe(
            stepsMapData,
            A.last,
            O.map((s) => s.id),
            (next): IntermediateStep => ({
              id: `${sequenceDescription.id}_${current.id}`,
              data: { ...current.config, next },
            }),
            (step) => A.append(step)(stepsMapData),
          ),
        ),
        A.reverse,
        O.fromPredicate((steps) => steps.length > 0),
        O.bindTo('steps'),
        O.bind('sequence', ({ steps }) =>
          O.of({
            id: sequenceDescription.id,
            name: sequenceDescription.name,
            firstStepId: steps[0].id,
          }),
        ),
      ),
    ),
    A.reduce(
      { sequences: [], steps: [] },
      (acc: IntermediateSequencesData, { sequence, steps }) => ({
        sequences: A.append(sequence)(acc.sequences),
        steps: A.concat(steps)(acc.steps),
      }),
    ),
    ({ sequences, steps }): ResultSequenceData => ({
      sequences,
      stepsMap: createStepsMap(new Map(steps.map((s) => [s.id, s.data]))),
    }),
  );
