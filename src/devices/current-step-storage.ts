import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/Option';

import { GetCurrentStep, RememberCurrentStep } from '../use-cases/dependencies/current-step';

type CurrentStepStorage = {
  getCurrentStep: GetCurrentStep;
  rememberCurrentStep: RememberCurrentStep;
};

const currentStepStorage = new Map<string, string>();

export const connectToCurrentStepStorage = (userId: string): CurrentStepStorage => ({
  getCurrentStep: () => O.fromNullable(currentStepStorage.get(userId)),
  rememberCurrentStep: (stepId) => {
    pipe(
      stepId,
      O.fold(
        () => void currentStepStorage.delete(userId),
        (id) => void currentStepStorage.set(userId, id),
      ),
    );
  },
});
