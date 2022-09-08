export type StepWithNext = { next: string | undefined };
export type StepWithLabel = { label: string };
export type StepWithSummaryLabel = { summaryLabel: string };
export type StepWithStaticChoices = { staticChoices?: string[] };
export type StepWithTransformer = { transformer?: (value: string) => string };

export type Step = StepWithNext &
  StepWithLabel &
  StepWithSummaryLabel &
  StepWithStaticChoices &
  StepWithTransformer;

export type StoredStep = { id: string; value: string };
export type StepUI = { id: string; label: string; choices?: string[] };
