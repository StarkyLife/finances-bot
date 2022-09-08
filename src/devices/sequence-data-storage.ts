import { StoredStep } from '../core/data/step';

const sequenceDataStorage = new Map<string, StoredStep[]>();

export const activateSequenceDataStorage = (userId: string) => ({
  saveStep: (id: string, value: string) => {
    const data = sequenceDataStorage.get(userId) ?? [];

    sequenceDataStorage.set(userId, [...data, { id, value }]);
  },
  getSequenceData: () => sequenceDataStorage.get(userId) ?? [],
  clearSequenceData: () => {
    sequenceDataStorage.delete(userId);
  },
});
