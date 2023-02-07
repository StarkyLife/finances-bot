import axios from 'axios';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constUndefined, pipe } from 'fp-ts/lib/function';
import * as TE from 'fp-ts/TaskEither';

import {
  ChangeWBOrderStatus,
  GetOrdersFromWildberries,
} from '../use-cases/dependencies/wildberries';
import { WildberriesOrdersResponse } from './data/wildberries-orders-response';

type WildberriesSDK = {
  getOrders: GetOrdersFromWildberries;
  // TODO: remove feature
  changeWBOrderStatus: ChangeWBOrderStatus;
};

export const connectToWildberries = (apiUrl: string, token: string): WildberriesSDK => {
  return {
    getOrders: () =>
      pipe(
        constUndefined(),
        TE.tryCatchK(
          () =>
            axios.get<WildberriesOrdersResponse>(`${apiUrl}/orders/new`, {
              headers: { Authorization: token },
            }),
          E.toError,
        ),
        TE.map((response) => response.data.orders),
        TE.map(
          A.map((o) => ({
            id: o.id,
            dateCreated: o.createdAt,
            officeAddress: o.address
              ? Object.values(o.address).filter(Boolean).join(', ')
              : '',
            currency: 'RUB',
            price: o.convertedPrice,
            article: o.article,
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
