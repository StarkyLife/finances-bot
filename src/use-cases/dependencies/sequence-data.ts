import { StoredSequence } from '../../core/data/stored-sequence';

export type CreateSequenceData = (sequenceId: string) => void;
export type GetSequenceData = () => StoredSequence | undefined;
export type ClearSequenceData = () => void;

export type SaveStep = (stepId: string, data: string) => void;
