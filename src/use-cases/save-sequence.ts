import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { identity, pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { StepWithTransformer } from '../core/data/step';
import { StepsMap } from '../core/data/steps-map';
import { GetSheetInfo, SaveInGoogleSheet } from './dependencies/google-sheet';
import { ClearSequenceData, GetSequenceData } from './dependencies/sequence-data';

export const saveSequenceUsecase =
  (stepsMap: StepsMap<StepWithTransformer>) =>
  async (deps: {
    getSequenceData: GetSequenceData;
    clearSequenceData: ClearSequenceData;
    getSheetInfo: GetSheetInfo;
    saveInGoogleSheet: SaveInGoogleSheet;
  }) => {
    const preparedData = pipe(
      deps.getSequenceData(),
      E.fromOption(() => new Error('No data to save!')),
      E.chain((sequenceData) =>
        pipe(
          deps.getSheetInfo(sequenceData.id),
          E.fromOption(() => new Error('No sheet info!')),
          E.map((sheetInfo) =>
            pipe(
              sequenceData.steps,
              A.map(({ id, value }) =>
                pipe(
                  stepsMap.getBy(id),
                  O.map((s) => s.transformer?.(value) || value),
                ),
              ),
              (sheetRow) => ({
                sheetRow,
                sheetInfo,
              }),
            ),
          ),
        ),
      ),
      E.fold((e) => {
        throw e;
      }, identity),
    );

    await deps.saveInGoogleSheet(preparedData.sheetInfo, [preparedData.sheetRow]);

    deps.clearSequenceData();
  };
