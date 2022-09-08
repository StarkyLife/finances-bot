import { SequenceWithName } from './sequence';
import {
  StepWithLabel,
  StepWithStaticChoices,
  StepWithSummaryLabel,
  StepWithTransformer,
} from './step';

export type StepDescription = {
  id: string;
  config: StepWithLabel & StepWithSummaryLabel & StepWithTransformer & StepWithStaticChoices;
};

export type SequenceDescription = SequenceWithName & {
  id: string;
  steps: StepDescription[];
};
