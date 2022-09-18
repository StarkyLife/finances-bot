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
    const sequenceData = deps.getSequenceData();
    if (sequenceData.isNone()) throw new Error('No data to save!');

    const sheetInfo = deps.getSheetInfo(sequenceData.value.id);
    if (sheetInfo.isNone()) throw new Error('No sheet info!');

    const sheetRow = sequenceData.value.steps.map(({ id, value }) =>
      stepsMap.getBy(id).map((s) => s.transformer?.(value) || value),
    );

    await deps.saveInGoogleSheet(sheetInfo.value, [sheetRow]);

    deps.clearSequenceData();
  };
