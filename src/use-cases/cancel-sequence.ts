import * as O from 'fp-ts/Option';

import { RememberCurrentStep } from './dependencies/current-step';
import { ClearSequenceData } from './dependencies/sequence-data';

export const cancelSequenceUsecase = (
  clearSequenceData: ClearSequenceData,
  rememberCurrentStep: RememberCurrentStep,
): void => {
  clearSequenceData();
  rememberCurrentStep(O.none);
};
