import { GetCurrentStep, RememberCurrentStep } from '../use-cases/dependencies/current-step';

type CurrentStepStorage = {
  getCurrentStep: GetCurrentStep;
  rememberCurrentStep: RememberCurrentStep;
};

const currentStepStorage = new Map<string, string>();

export const connectToCurrentStepStorage = (userId: string): CurrentStepStorage => ({
  getCurrentStep: () => currentStepStorage.get(userId),
  rememberCurrentStep: (stepId) => {
    if (!stepId) {
      currentStepStorage.delete(userId);
      return;
    }
    currentStepStorage.set(userId, stepId);
  },
});
