import { formatInTimeZone } from 'date-fns-tz';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/lib/function';
import * as T from 'fp-ts/Task';
import * as TE from 'fp-ts/TaskEither';

import { OrderPresentation } from '../core/data/orders';
import { GetOrdersFromCache, UpdateOrdersInCache } from './dependencies/orders-cache';
import { GetOrdersFromWildberries } from './dependencies/wildberries';

export const presentNewOrdersUsecase = (
  getOrdersFromWildberries: GetOrdersFromWildberries,
  getOrdersFromCache: GetOrdersFromCache,
  updateOrdersInCache: UpdateOrdersInCache,
): TE.TaskEither<Error, OrderPresentation[]> =>
  pipe(
    getOrdersFromWildberries(),
    TE.bindTo('orders'),
    TE.bind('knownOrdersIds', () => TE.of(getOrdersFromCache())),
    TE.chainFirstTaskK(({ orders }) =>
      pipe(
        orders,
        A.map((o) => o.id),
        updateOrdersInCache,
        T.of,
      ),
    ),
    TE.map(({ orders, knownOrdersIds }) => orders.filter((o) => !knownOrdersIds.includes(o.id))),
    TE.map(
      A.map(
        (o): OrderPresentation => ({
          id: o.id,
          dateCreated: formatInTimeZone(
            new Date(o.dateCreated),
            'Europe/Moscow',
            'dd.MM.yyyy HH:mm',
          ),
          officeAddress: o.officeAddress,
          price: `${o.price / 100} ${o.currency}`,
          article: o.article,
        }),
      ),
    ),
  );
