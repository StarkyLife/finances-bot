import { SequenceWithName } from './sequence';
import { StepWithLabel, StepWithStaticChoices, StepWithTransformer } from './step';

export type StepDescription = {
  id: string;
  config: StepWithLabel & StepWithTransformer & StepWithStaticChoices;
};

export type SequenceDescription = SequenceWithName & {
  id: string;
  steps: StepDescription[];
};
