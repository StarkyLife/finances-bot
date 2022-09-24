import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';
import * as TE from 'fp-ts/TaskEither';

import { StepWithTransformer } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { GetSheetInfo, SaveInGoogleSheet } from './dependencies/google-sheet';
import { ClearSequenceData, GetSequenceData } from './dependencies/sequence-data';

export const saveSequenceUsecase =
  (stepsMap: StepsMap<StepWithTransformer>) =>
  (deps: {
    getSequenceData: GetSequenceData;
    clearSequenceData: ClearSequenceData;
    getSheetInfo: GetSheetInfo;
    saveInGoogleSheet: SaveInGoogleSheet;
  }) =>
    pipe(
      deps.getSequenceData(),
      E.fromOption(() => new Error('No data to save!')),
      E.bindTo('sequenceData'),
      E.bind('sheetInfo', ({ sequenceData }) =>
        pipe(
          deps.getSheetInfo(sequenceData.id),
          E.fromOption(() => new Error('No sheet info!')),
        ),
      ),
      E.bind('sheetRow', ({ sequenceData }) =>
        E.of(
          pipe(
            sequenceData.steps,
            A.map(({ id, value }) =>
              pipe(
                stepsMap.getBy(id),
                O.chain((s) =>
                  pipe(
                    s.transformer,
                    O.flap(value),
                    O.alt(() => O.some(value)),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
      TE.fromEither,
      TE.chain(({ sheetInfo, sheetRow }) => deps.saveInGoogleSheet(sheetInfo, [sheetRow])),
      TE.map(() => deps.clearSequenceData()),
    );
