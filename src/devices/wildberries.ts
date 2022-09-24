import axios from 'axios';
import { formatRFC3339, startOfToday } from 'date-fns';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import { GetOrdersFromWildberries } from '../use-cases/dependencies/wildberries';
import { WildberriesOrdersResponse } from './data/wildberries-orders-response';

type WildberriesSDK = {
  getOrders: GetOrdersFromWildberries;
};

export const connectToWildberries = (token: string): WildberriesSDK => {
  return {
    getOrders: () =>
      pipe(
        new URLSearchParams({
          date_start: formatRFC3339(startOfToday()),
          take: '100',
          skip: '0',
        }).toString(),
        TE.tryCatchK(
          (params) =>
            axios.get<WildberriesOrdersResponse>(
              `https://suppliers-api.wildberries.ru/api/v2/orders?${params}`,
              { headers: { Authorization: token } },
            ),
          E.toError,
        ),
        TE.map((response) => response.data.orders),
        TE.map(
          A.map((o) => ({
            id: o.orderId,
            dateCreated: o.dateCreated,
            officeAddress: o.officeAddress,
            currency: 'RUB',
            price: o.convertedPrice,
          })),
        ),
      ),
  };
};
