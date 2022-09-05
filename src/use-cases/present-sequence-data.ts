import { StepWithLabel } from '../core/data/step';
import { filterOutNulls } from '../utils/filters';

export const presentSequenceData =
  (stepsMap: Map<string, StepWithLabel>) => (getSequenceData: () => Record<string, string>) => {
    const data = getSequenceData();

    return Object.keys(data)
      .map((key) => {
        const step = stepsMap.get(key);

        if (!step) return null;

        return {
          id: key,
          label: step.label,
          value: data[key],
        };
      })
      .filter(filterOutNulls);
  };
