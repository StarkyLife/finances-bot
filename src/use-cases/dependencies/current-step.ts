import { Maybe } from '@sweet-monads/maybe';

export type RememberCurrentStep = (stepId: Maybe<string>) => void;
export type GetCurrentStep = () => Maybe<string>;
