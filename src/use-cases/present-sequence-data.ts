import LazyIterator from '@sweet-monads/iterator';
import { just } from '@sweet-monads/maybe';
import * as E from 'fp-ts/Either';

import { StepWithSummaryLabel } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { StoredStep } from '../core/data/stored-sequence';
import { SummaryItem } from '../core/data/summary-item';
import { GetSequenceData } from './dependencies/sequence-data';

export const presentSequenceDataUsecase =
  (stepsMap: StepsMap<StepWithSummaryLabel>) =>
  (getSequenceData: GetSequenceData): E.Either<Error, SummaryItem[]> => {
    const createSummaryItem = ({ id, value }: StoredStep) =>
      stepsMap.getBy(id).map((s) => ({ id, label: s.summaryLabel, value }));

    return getSequenceData()
      .map((data) => LazyIterator.from(data.steps).filterMap(createSummaryItem))
      .map((summary) => E.right<Error, SummaryItem[]>(Array.from(summary.collect())))
      .or(just(E.left(new Error('No data to present!'))))
      .unwrap();
  };
