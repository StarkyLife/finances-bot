import { SheetInfo } from '../core/data/sheet';
import { StepWithTransformer } from '../core/data/step';
import { StoredSequence } from '../core/data/stored-sequence';
import { checkExistence } from '../utils/filters';

export const saveSequenceUsecase =
  (stepsMap: Map<string, StepWithTransformer>) =>
  async (deps: {
    getSequenceData: () => StoredSequence | undefined;
    clearSequenceData: () => void;
    getSheetInfo: (sequenceId: string) => SheetInfo | undefined;
    saveInGoogleSheet: (
      sheetInfo: SheetInfo,
      data: Array<Array<string | undefined>>,
    ) => Promise<void>;
  }) => {
    const sequenceData = deps.getSequenceData();
    if (!sequenceData?.steps.length) throw new Error('No data to save!');

    const sheetInfo = deps.getSheetInfo(sequenceData.id);
    if (!sheetInfo) throw new Error('No sheet info!');

    const sheetRow = sequenceData.steps
      .map(({ id, value }) => {
        const step = stepsMap.get(id);
        if (!step) return undefined;

        return step.transformer?.(value) || value;
      })
      .filter(checkExistence);

    await deps.saveInGoogleSheet(sheetInfo, [sheetRow]);

    deps.clearSequenceData();
  };
