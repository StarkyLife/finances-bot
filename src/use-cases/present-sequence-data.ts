import { StepWithSummaryLabel } from '../core/data/step';
import { StoredSequence } from '../core/data/stored-sequence';
import { checkExistence } from '../utils/filters';

export const presentSequenceDataUsecase =
  (stepsMap: Map<string, StepWithSummaryLabel>) =>
  (getSequenceData: () => StoredSequence | undefined) => {
    const data = getSequenceData();

    if (!data?.steps.length) throw new Error('No data to present!');

    return data.steps
      .map(({ id, value }) => {
        const step = stepsMap.get(id);
        if (!step) return undefined;

        return { id, label: step.summaryLabel, value };
      })
      .filter(checkExistence);
  };
