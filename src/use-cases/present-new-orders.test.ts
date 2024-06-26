import * as TE from 'fp-ts/TaskEither';

import { WBOrder } from '../core/data/orders';
import { presentNewOrdersUsecase } from './present-new-orders';

const createWBOrder = (order: Partial<WBOrder>): WBOrder => ({
  id: 'standardOrderId',
  dateCreated: '2022-09-17T10:00:00+03:00',
  officeAddress: 'г Москва (Россия), Большой Казенный переулок, д. 10с2',
  currency: 'RUB',
  price: 135355,
  article: 'one-ring-7548',
  ...order,
});

it('should present only unknown new orders', async () => {
  const orders = [createWBOrder({ id: 'unknownOrderId' }), createWBOrder({ id: 'knownOrderId' })];
  const knownOrdersIds = ['knownOrderId'];

  const getOrdersFromWildberries = jest.fn().mockReturnValue(TE.right(orders));
  const getOrdersFromCache = jest.fn().mockReturnValue(knownOrdersIds);
  const updateOrdersInCache = jest.fn();

  const ordersPresentation = await TE.toUnion(
    presentNewOrdersUsecase(getOrdersFromWildberries, getOrdersFromCache, updateOrdersInCache),
  )();

  expect(ordersPresentation).toEqual([
    {
      id: 'unknownOrderId',
      dateCreated: '17.09.2022 10:00',
      officeAddress: 'г Москва (Россия), Большой Казенный переулок, д. 10с2',
      price: '1353.55 RUB',
      article: 'one-ring-7548',
    },
  ]);
});

it('should update cache', async () => {
  const orders = [createWBOrder({ id: 'unknownOrderId' }), createWBOrder({ id: 'knownOrderId' })];
  const knownOrdersIds = ['knownOrderId', 'outdatedOrderId'];

  const getOrdersFromWildberries = jest.fn().mockReturnValue(TE.right(orders));
  const getOrdersFromCache = jest.fn().mockReturnValue(knownOrdersIds);
  const updateOrdersInCache = jest.fn();

  await presentNewOrdersUsecase(
    getOrdersFromWildberries,
    getOrdersFromCache,
    updateOrdersInCache,
  )();

  expect(updateOrdersInCache).toHaveBeenCalledWith(orders.map((o) => o.id));
});

it('should handle error from WB', async () => {
  const WB_ERROR = new Error('Error in getting orders');

  const getOrdersFromWildberries = jest.fn().mockReturnValue(TE.throwError(WB_ERROR));
  const getOrdersFromCache = jest.fn().mockReturnValue([]);
  const updateOrdersInCache = jest.fn();

  const result = await TE.toUnion(
    presentNewOrdersUsecase(getOrdersFromWildberries, getOrdersFromCache, updateOrdersInCache),
  )();

  expect(result).toEqual(WB_ERROR);
});
