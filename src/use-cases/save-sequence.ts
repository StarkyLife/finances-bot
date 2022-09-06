import { SheetInfo } from '../core/data/sheet';
import { StepWithTransformer, StoredStep } from '../core/data/step';
import { checkExistence } from '../utils/filters';

export const saveSequence =
  (stepsMap: Map<string, StepWithTransformer>) =>
  async (deps: {
    getSequenceData: () => StoredStep[];
    clearSequenceData: () => void;
    getSheetInfo: () => SheetInfo | undefined;
    saveInGoogleSheet: (
      sheetInfo: SheetInfo,
      data: Array<Array<string | undefined>>,
    ) => Promise<void>;
  }) => {
    const sequenceData = deps.getSequenceData();
    if (!sequenceData.length) throw new Error('No data to save!');

    const sheetInfo = deps.getSheetInfo();
    if (!sheetInfo) throw new Error('No sheet id!');

    const sheetRow = sequenceData
      .map(({ id, value }) => {
        const step = stepsMap.get(id);
        if (!step) return undefined;

        return step.transformer?.(value) || value;
      })
      .filter(checkExistence);

    await deps.saveInGoogleSheet(sheetInfo, [sheetRow]);

    deps.clearSequenceData();
  };
