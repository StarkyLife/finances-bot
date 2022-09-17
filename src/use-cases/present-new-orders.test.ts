import { WBOrder } from '../core/data/orders';
import { presentNewOrdersUsecase } from './present-new-orders';

const createWBOrder = (order: Partial<WBOrder>): WBOrder => ({
  id: 'standardOrderId',
  dateCreated: new Date('2022-09-17T10:00:00').toISOString(),
  officeAddress: 'г Москва (Россия), Большой Казенный переулок, д. 10с2',
  currency: 'RUB',
  totalPrice: 135355,
  ...order,
});

it('should present only unknown new orders', async () => {
  const orders = [createWBOrder({ id: 'unknownOrderId' }), createWBOrder({ id: 'knownOrderId' })];
  const knownOrdersIds = ['knownOrderId'];

  const getOrdersFromWildberries = jest.fn().mockResolvedValue(orders);
  const getKnownOrdersIds = jest.fn().mockReturnValue(knownOrdersIds);
  const updateKnownOrders = jest.fn();

  const ordersPresentation = await presentNewOrdersUsecase(
    getOrdersFromWildberries,
    getKnownOrdersIds,
    updateKnownOrders,
  )();

  expect(ordersPresentation).toEqual([
    {
      id: 'unknownOrderId',
      dateCreated: '17.09.2022 10:00',
      officeAddress: 'г Москва (Россия), Большой Казенный переулок, д. 10с2',
      price: '1353.55 RUB',
    },
  ]);
});

it('should update cache', async () => {
  const orders = [createWBOrder({ id: 'unknownOrderId' }), createWBOrder({ id: 'knownOrderId' })];
  const knownOrdersIds = ['knownOrderId', 'outdatedOrderId'];

  const getOrdersFromWildberries = jest.fn().mockResolvedValue(orders);
  const getKnownOrdersIds = jest.fn().mockReturnValue(knownOrdersIds);
  const updateKnownOrders = jest.fn();

  await presentNewOrdersUsecase(getOrdersFromWildberries, getKnownOrdersIds, updateKnownOrders)();

  expect(updateKnownOrders).toHaveBeenCalledWith(orders.map((o) => o.id));
});
