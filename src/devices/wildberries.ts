import axios from 'axios';
import { formatRFC3339, startOfToday } from 'date-fns';

import { GetOrdersFromWildberries } from '../use-cases/dependencies/wildberries';
import { WildberriesOrdersResponse } from './data/wildberries-orders-response';

type WildberriesSDK = {
  getOrders: GetOrdersFromWildberries;
};

export const connectToWildberries = (token: string): WildberriesSDK => {
  return {
    getOrders: async () => {
      const params = new URLSearchParams({
        date_start: formatRFC3339(startOfToday()),
        take: '100',
        skip: '0',
      });

      const response = await axios.get<WildberriesOrdersResponse>(
        `https://suppliers-api.wildberries.ru/api/v2/orders?${params.toString()}`,
        {
          headers: { Authorization: token },
        },
      );

      return response.data.orders.map((o) => ({
        id: o.orderId,
        vendorCode: `${o.chrtId}`,
        dateCreated: o.dateCreated,
        officeAddress: o.officeAddress,
        currency: 'RUB',
        price: o.convertedPrice,
      }));
    },
  };
};
