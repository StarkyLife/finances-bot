import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { StepWithSummaryLabel } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { SummaryItem } from '../core/data/summary-item';
import { GetSequenceData } from './dependencies/sequence-data';

export const presentSequenceDataUsecase =
  (stepsMap: StepsMap<StepWithSummaryLabel>) =>
  (getSequenceData: GetSequenceData): E.Either<Error, SummaryItem[]> =>
    pipe(
      getSequenceData(),
      E.fromOption(() => new Error('No data to present!')),
      E.map((data) =>
        pipe(
          data.steps,
          A.filterMap(({ id, value }) =>
            pipe(
              stepsMap.getBy(id),
              O.map((s): SummaryItem => ({ id, label: s.summaryLabel, value })),
            ),
          ),
        ),
      ),
    );
