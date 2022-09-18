import { Either } from '@sweet-monads/either';
import { Maybe } from '@sweet-monads/maybe';

import { StoredSequence } from '../../core/data/stored-sequence';

export type CreateSequenceData = (sequenceId: string) => void;
export type GetSequenceData = () => Maybe<StoredSequence>;
export type ClearSequenceData = () => void;

export type SaveStep = (stepId: string, data: string) => Either<Error, undefined>;
