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
          id: 'stepId',
          config: {
            label: 'stepLabel',
          },
        },
      ],
    },
  ];

  const { sequences } = configureSequences(sequencesDescriptions);

  expect(sequences).toEqual([
    {
      name: 'sequenceName',
      firstStepId: 'sequenceId_stepId',
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
            staticChoices: ['choice1'],
            transformer: stepTransformer,
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
          next: undefined,
          label: 'stepLabel',
          staticChoices: ['choice1'],
          transformer: stepTransformer,
        },
      ],
    ]),
  );
});
