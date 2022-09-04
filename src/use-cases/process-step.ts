import { StepsMap } from '../core/data/steps-map';

export const processStep =
  (stepsMap: StepsMap) =>
  (saveStep: (stepId: string, data: string) => void, stepId: string, data: string) => {
    saveStep(stepId, data);
    return stepsMap.get(stepId);
  };
