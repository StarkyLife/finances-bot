import { configureSequences } from './configure-sequences';
import { SequenceDescription } from './data/sequence-description';
import { Step } from './data/step';

it('should throw if there is no sequences', () => {
  const sequencesDescriptions: SequenceDescription[] = [];

  expect(() => configureSequences(sequencesDescriptions)).toThrow();
});

it('should throw if found sequence without steps', () => {
  const sequencesDescriptions: SequenceDescription[] = [
    { id: 'sequenceId', name: 'sequenceName', steps: [] },
  ];

  expect(() => configureSequences(sequencesDescriptions)).toThrow();
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
          },
        },
        {
          id: 'secondStepId',
          config: {
            label: 'secondStepLabel',
            summaryLabel: 'secondStepSummary',
          },
        },
      ],
    },
  ];

  const { sequences } = configureSequences(sequencesDescriptions);

  expect(sequences).toEqual([
    {
      name: 'sequenceName',
      firstStepId: 'sequenceId_firstStepId',
    },
  ]);
});

it('should construct steps map', () => {
  const stepTransformer = jest.fn();

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
          },
        },
      ],
    },
  ];

  const { stepsMap } = configureSequences(sequencesDescriptions);

  expect(stepsMap).toEqual(
    new Map<string, Step>([
      [
        'sequenceId_stepId',
        {
          next: 'sequenceId_nextStepId',
          label: 'stepLabel',
          summaryLabel: 'stepSummary',
          staticChoices: ['choice1'],
          transformer: stepTransformer,
        },
      ],
      [
        'sequenceId_nextStepId',
        {
          next: undefined,
          label: 'nextStepLabel',
          summaryLabel: 'nextStepSummary',
        },
      ],
    ]),
  );
});
