export const cancelSequenceUsecase = (
  clearSequenceData: () => void,
  rememberCurrentStep: (stepId: string | undefined) => void,
) => {
  clearSequenceData();
  rememberCurrentStep(undefined);
};
