import * as O from 'fp-ts/Option';

export type RememberCurrentStep = (stepId: O.Option<string>) => void;
export type GetCurrentStep = () => O.Option<string>;
