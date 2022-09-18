import LazyIterator from '@sweet-monads/iterator';

import { StepWithSummaryLabel } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { GetSequenceData } from './dependencies/sequence-data';

export const presentSequenceDataUsecase =
  (stepsMap: StepsMap<StepWithSummaryLabel>) => (getSequenceData: GetSequenceData) => {
    const data = getSequenceData();

    if (data.isNone()) throw new Error('No data to present!');

    const summary = LazyIterator.from(data.value.steps)
      .filterMap(({ id, value }) =>
        stepsMap.getBy(id).map((s) => ({ id, label: s.summaryLabel, value })),
      )
      .collect();

    return Array.from(summary);
  };
