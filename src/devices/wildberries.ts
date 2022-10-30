import axios from 'axios';
import { formatRFC3339, startOfToday } from 'date-fns';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import {
  ChangeWBOrderStatus,
  GetOrdersFromWildberries,
} from '../use-cases/dependencies/wildberries';
import { WildberriesOrdersResponse } from './data/wildberries-orders-response';

type WildberriesSDK = {
  getOrders: GetOrdersFromWildberries;
  changeWBOrderStatus: ChangeWBOrderStatus;
};

export const connectToWildberries = (apiUrl: string, token: string): WildberriesSDK => {
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
            axios.get<WildberriesOrdersResponse>(`${apiUrl}/orders?${params}`, {
              headers: { Authorization: token },
            }),
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
            status: o.status,
          })),
        ),
      ),
    changeWBOrderStatus: (orderId, orderStatus) =>
      pipe(
        [{ orderId, status: orderStatus }],
        TE.tryCatchK(
          (data) =>
            axios.put(`${apiUrl}/orders`, data, {
              headers: { Authorization: token },
            }),
          E.toError,
        ),
      ),
  };
};
