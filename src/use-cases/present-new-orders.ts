import { format } from 'date-fns';

import { OrderPresentation } from '../core/data/orders';
import { GetOrdersFromCache, UpdateOrdersInCache } from './dependencies/orders-cache';
import { GetOrdersFromWildberries } from './dependencies/wildberries';

export const presentNewOrdersUsecase =
  (
    getOrdersFromWildberries: GetOrdersFromWildberries,
    getOrdersFromCache: GetOrdersFromCache,
    updateOrdersInCache: UpdateOrdersInCache,
  ) =>
  async (): Promise<OrderPresentation[]> => {
    const orders = await getOrdersFromWildberries('new');

    const knownOrdersIds = getOrdersFromCache();
    const unknownOrders = orders.filter((o) => !knownOrdersIds.includes(o.id));

    updateOrdersInCache(orders.map((o) => o.id));

    return unknownOrders.map((o) => ({
      id: o.id,
      dateCreated: format(new Date(o.dateCreated), 'dd.MM.yyyy HH:mm'),
      officeAddress: o.officeAddress,
      price: `${o.price / 100} ${o.currency}`,
    }));
  };
