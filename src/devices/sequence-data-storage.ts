import { StoredSequence } from '../core/data/stored-sequence';

const sequenceDataStorage = new Map<string, StoredSequence>();

export const activateSequenceDataStorage = (userId: string) => ({
  createSequenceData: (sequenceId: string) => {
    sequenceDataStorage.set(userId, { id: sequenceId, steps: [] });
  },
  getSequenceData: () => sequenceDataStorage.get(userId),
  clearSequenceData: () => {
    sequenceDataStorage.delete(userId);
  },
  saveStep: (id: string, value: string) => {
    const data = sequenceDataStorage.get(userId);
    if (!data) throw new Error("Can't find sequence to save");

    sequenceDataStorage.set(userId, { ...data, steps: [...data.steps, { id, value }] });
  },
});
