import { StepWithSummaryLabel, StoredStep } from '../core/data/step';
import { checkExistence } from '../utils/filters';

export const presentSequenceDataUsecase =
  (stepsMap: Map<string, StepWithSummaryLabel>) => (getSequenceData: () => StoredStep[]) => {
    const data = getSequenceData();

    if (!data.length) throw new Error('No data to present!');

    return data
      .map(({ id, value }) => {
        const step = stepsMap.get(id);
        if (!step) return undefined;

        return { id, label: step.summaryLabel, value };
      })
      .filter(checkExistence);
  };
