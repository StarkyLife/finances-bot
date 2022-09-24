import * as TE from 'fp-ts/TaskEither';

import { WBOrder } from '../../core/data/orders';

export type GetOrdersFromWildberries = () => TE.TaskEither<Error, WBOrder[]>;
