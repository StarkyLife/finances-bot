export type SequenceWithId = { id: string };
export type SequenceWithName = { name: string };
export type SequenceWithFirstStepId = { firstStepId: string };

export type Sequence = SequenceWithId & SequenceWithName & SequenceWithFirstStepId;
