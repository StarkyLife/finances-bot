import { none } from '@sweet-monads/maybe';

import { RememberCurrentStep } from './dependencies/current-step';
import { ClearSequenceData } from './dependencies/sequence-data';

export const cancelSequenceUsecase = (
  clearSequenceData: ClearSequenceData,
  rememberCurrentStep: RememberCurrentStep,
) => {
  clearSequenceData();
  rememberCurrentStep(none());
};
