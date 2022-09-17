import { format } from 'date-fns';

import { OrderPresentation, OrderStatus, WBOrder } from '../core/data/orders';

export const presentNewOrdersUsecase =
  (
    getOrdersFromWildberries: (status: OrderStatus) => Promise<WBOrder[]>,
    getKnownOrdersIds: () => string[],
    updateKnownOrders: (ids: string[]) => void,
  ) =>
  async (): Promise<OrderPresentation[]> => {
    const orders = await getOrdersFromWildberries('new');

    const knownOrdersIds = getKnownOrdersIds();
    const unknownOrders = orders.filter((o) => !knownOrdersIds.includes(o.id));

    updateKnownOrders(orders.map((o) => o.id));

    return unknownOrders.map((o) => ({
      id: o.id,
      dateCreated: format(new Date(o.dateCreated), 'dd.MM.yyyy HH:mm'),
      officeAddress: o.officeAddress,
      price: `${o.totalPrice / 100} ${o.currency}`,
    }));
  };
