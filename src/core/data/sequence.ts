export type SequenceWithName = { name: string };
export type SequenceWithFirstStepId = { firstStepId: string };

export type Sequence = SequenceWithName & SequenceWithFirstStepId;
