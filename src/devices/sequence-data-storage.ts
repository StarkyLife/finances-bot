import { left, right } from '@sweet-monads/either';
import { fromNullable } from '@sweet-monads/maybe';

import { StoredSequence } from '../core/data/stored-sequence';
import {
  ClearSequenceData,
  CreateSequenceData,
  GetSequenceData,
  SaveStep,
} from '../use-cases/dependencies/sequence-data';

type SequenceDataStorage = {
  createSequenceData: CreateSequenceData;
  getSequenceData: GetSequenceData;
  clearSequenceData: ClearSequenceData;
  saveStep: SaveStep;
};

const sequenceDataStorage = new Map<string, StoredSequence>();

export const connectToSequenceDataStorage = (userId: string): SequenceDataStorage => ({
  createSequenceData: (sequenceId) => {
    sequenceDataStorage.set(userId, { id: sequenceId, steps: [] });
  },
  getSequenceData: () => fromNullable(sequenceDataStorage.get(userId)),
  clearSequenceData: () => {
    sequenceDataStorage.delete(userId);
  },
  saveStep: (id, value) => {
    const data = sequenceDataStorage.get(userId);
    if (!data) return left(new Error("Can't find sequence to save"));

    sequenceDataStorage.set(userId, { ...data, steps: [...data.steps, { id, value }] });
    return right(undefined);
  },
});
