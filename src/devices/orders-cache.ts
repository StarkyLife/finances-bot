import { GetOrdersFromCache, UpdateOrdersInCache } from '../use-cases/dependencies/orders-cache';

type OrdersCache = {
  getOrdersIds: GetOrdersFromCache;
  updateOrdersIds: UpdateOrdersInCache;
};

const ordersCache = new Map<string, string[]>();

export const connectToOrdersCache = (userId: string): OrdersCache => {
  return {
    getOrdersIds: () => ordersCache.get(userId) ?? [],
    updateOrdersIds: (ids) => {
      ordersCache.set(userId, ids);
    },
  };
};
