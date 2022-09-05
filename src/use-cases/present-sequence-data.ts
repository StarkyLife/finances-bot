import { StepWithLabel, StoredStep } from '../core/data/step';
import { filterOutNulls } from '../utils/filters';

export const presentSequenceData =
  (stepsMap: Map<string, StepWithLabel>) => (getSequenceData: () => StoredStep[]) => {
    const data = getSequenceData();

    if (!data.length) throw new Error('No data to present!');

    return data
      .map(({ id, value }) => {
        const step = stepsMap.get(id);

        if (!step) return null;

        return { id, label: step.label, value };
      })
      .filter(filterOutNulls);
  };
