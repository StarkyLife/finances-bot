import * as O from 'fp-ts/Option';

export type StepWithNext = { next: O.Option<string> };
export type StepWithLabel = { label: string };
export type StepWithSummaryLabel = { summaryLabel: string };
export type StepWithStaticChoices = { staticChoices?: string[] };
export type StepWithTransformer = { transformer: O.Option<(value: string) => string> };

export type Step = StepWithNext &
  StepWithLabel &
  StepWithSummaryLabel &
  StepWithStaticChoices &
  StepWithTransformer;

export type StepUI = { id: string; label: string; choices?: string[] };
