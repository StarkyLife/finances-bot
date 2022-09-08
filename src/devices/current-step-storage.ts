const currentStepStorage = new Map<string, string>();

export const activateCurrentStepStorage = (userId: string) => ({
  getCurrentStep: () => currentStepStorage.get(userId),
  rememberCurrentStep: (stepId: string | undefined) => {
    if (!stepId) {
      currentStepStorage.delete(userId);
      return;
    }
    currentStepStorage.set(userId, stepId);
  },
});
