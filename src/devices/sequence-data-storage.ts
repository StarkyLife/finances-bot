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
  getSequenceData: () => sequenceDataStorage.get(userId),
  clearSequenceData: () => {
    sequenceDataStorage.delete(userId);
  },
  saveStep: (id, value) => {
    const data = sequenceDataStorage.get(userId);
    if (!data) throw new Error("Can't find sequence to save");

    sequenceDataStorage.set(userId, { ...data, steps: [...data.steps, { id, value }] });
  },
});
