import { formatInTimeZone } from 'date-fns-tz';

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
    const orders = await getOrdersFromWildberries();

    const knownOrdersIds = getOrdersFromCache();
    const unknownOrders = orders.filter((o) => !knownOrdersIds.includes(o.id));

    updateOrdersInCache(orders.map((o) => o.id));

    return unknownOrders.map((o) => ({
      id: o.id,
      dateCreated: formatInTimeZone(new Date(o.dateCreated), 'Europe/Moscow', 'dd.MM.yyyy HH:mm'),
      officeAddress: o.officeAddress,
      price: `${o.price / 100} ${o.currency}`,
    }));
  };
