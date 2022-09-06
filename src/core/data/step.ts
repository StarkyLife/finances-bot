export type StepWithNext = { next: string | undefined };
export type StepWithLabel = { label: string };
export type StepWithTransformer = { transformer?: (value: string) => string };

export type StoredStep = { id: string; value: string };
