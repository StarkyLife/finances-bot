import { StepWithTransformer } from '../core/data/step';
import { checkExistence } from '../utils/filters';
import { GetSheetInfo, SaveInGoogleSheet } from './dependencies/google-sheet';
import { ClearSequenceData, GetSequenceData } from './dependencies/sequence-data';

export const saveSequenceUsecase =
  (stepsMap: Map<string, StepWithTransformer>) =>
  async (deps: {
    getSequenceData: GetSequenceData;
    clearSequenceData: ClearSequenceData;
    getSheetInfo: GetSheetInfo;
    saveInGoogleSheet: SaveInGoogleSheet;
  }) => {
    const sequenceData = deps.getSequenceData();
    if (sequenceData.isNone()) throw new Error('No data to save!');

    const sheetInfo = deps.getSheetInfo(sequenceData.value.id);
    if (!sheetInfo) throw new Error('No sheet info!');

    const sheetRow = sequenceData.value.steps
      .map(({ id, value }) => {
        const step = stepsMap.get(id);
        if (!step) return undefined;

        return step.transformer?.(value) || value;
      })
      .filter(checkExistence);

    await deps.saveInGoogleSheet(sheetInfo, [sheetRow]);

    deps.clearSequenceData();
  };
