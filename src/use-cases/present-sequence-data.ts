import { StepWithSummaryLabel } from '../core/data/step';
import { checkExistence } from '../utils/filters';
import { GetSequenceData } from './dependencies/sequence-data';

export const presentSequenceDataUsecase =
  (stepsMap: Map<string, StepWithSummaryLabel>) => (getSequenceData: GetSequenceData) => {
    const data = getSequenceData();

    if (data.isNone()) throw new Error('No data to present!');

    return data.value.steps
      .map(({ id, value }) => {
        const step = stepsMap.get(id);
        if (!step) return undefined;

        return { id, label: step.summaryLabel, value };
      })
      .filter(checkExistence);
  };
