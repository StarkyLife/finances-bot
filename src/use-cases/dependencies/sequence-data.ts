import { Maybe } from '@sweet-monads/maybe';
import * as E from 'fp-ts/Either';

import { StoredSequence } from '../../core/data/stored-sequence';

export type CreateSequenceData = (sequenceId: string) => void;
export type GetSequenceData = () => Maybe<StoredSequence>;
export type ClearSequenceData = () => void;

export type SaveStep = (stepId: string, data: string) => E.Either<Error, undefined>;
