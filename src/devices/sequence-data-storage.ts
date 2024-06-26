import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

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
  getSequenceData: () => O.fromNullable(sequenceDataStorage.get(userId)),
  clearSequenceData: () => {
    sequenceDataStorage.delete(userId);
  },
  saveStep: (id, value) =>
    pipe(
      sequenceDataStorage.get(userId),
      E.fromNullable(new Error("Can't find sequence to save")),
      E.map(
        (data) =>
          void sequenceDataStorage.set(userId, { ...data, steps: [...data.steps, { id, value }] }),
      ),
    ),
});
