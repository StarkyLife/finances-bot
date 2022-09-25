import * as O from 'fp-ts/Option';

import { configureSequences } from './configure-sequences';
import { SequenceDescription } from './data/sequence-description';
import { Step } from './data/step';

it('should return empty sequences given no sequences', () => {
  const sequencesDescriptions: SequenceDescription[] = [];

  const { sequences } = configureSequences(sequencesDescriptions);

  expect(sequences).toEqual([]);
});

it('should skip sequence without steps', () => {
  const sequencesDescriptions: SequenceDescription[] = [
    { id: 'sequenceId', name: 'sequenceName', steps: [] },
  ];

  const { sequences } = configureSequences(sequencesDescriptions);

  expect(sequences).toEqual([]);
});

it('should construct sequence', () => {
  const sequencesDescriptions: SequenceDescription[] = [
    {
      id: 'sequenceId',
      name: 'sequenceName',
      steps: [
        {
          id: 'firstStepId',
          config: {
            label: 'firstStepLabel',
            summaryLabel: 'firstStepSummary',
            transformer: O.none,
          },
        },
        {
          id: 'secondStepId',
          config: {
            label: 'secondStepLabel',
            summaryLabel: 'secondStepSummary',
            transformer: O.none,
          },
        },
      ],
    },
  ];

  const { sequences } = configureSequences(sequencesDescriptions);

  expect(sequences).toEqual([
    {
      id: 'sequenceId',
      name: 'sequenceName',
      firstStepId: 'sequenceId_firstStepId',
    },
  ]);
});

it('should construct steps map', () => {
  const stepTransformer = O.some(jest.fn());

  const sequencesDescriptions: SequenceDescription[] = [
    {
      id: 'sequenceId',
      name: 'sequenceName',
      steps: [
        {
          id: 'stepId',
          config: {
            label: 'stepLabel',
            summaryLabel: 'stepSummary',
            staticChoices: ['choice1'],
            transformer: stepTransformer,
          },
        },
        {
          id: 'nextStepId',
          config: {
            label: 'nextStepLabel',
            summaryLabel: 'nextStepSummary',
            transformer: O.none,
          },
        },
      ],
    },
  ];

  const { stepsMap } = configureSequences(sequencesDescriptions);

  expect(stepsMap.internalData).toEqual(
    new Map<string, Step>([
      [
        'sequenceId_stepId',
        {
          next: O.some('sequenceId_nextStepId'),
          label: 'stepLabel',
          summaryLabel: 'stepSummary',
          staticChoices: ['choice1'],
          transformer: stepTransformer,
        },
      ],
      [
        'sequenceId_nextStepId',
        {
          next: O.none,
          label: 'nextStepLabel',
          summaryLabel: 'nextStepSummary',
          transformer: O.none,
        },
      ],
    ]),
  );
});
