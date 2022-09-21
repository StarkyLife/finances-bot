import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

import { StoredSequence } from '../../core/data/stored-sequence';

export type CreateSequenceData = (sequenceId: string) => void;
export type GetSequenceData = () => O.Option<StoredSequence>;
export type ClearSequenceData = () => void;

export type SaveStep = (stepId: string, data: string) => E.Either<Error, undefined>;
