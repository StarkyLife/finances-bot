import * as TE from 'fp-ts/TaskEither';

import { OrderStatus, WBOrder } from '../../core/data/orders';

export type GetOrdersFromWildberries = () => TE.TaskEither<Error, WBOrder[]>;

export type ChangeWBOrderStatus = (
  orderId: string,
  orderStatus: OrderStatus,
) => TE.TaskEither<Error, void>;
