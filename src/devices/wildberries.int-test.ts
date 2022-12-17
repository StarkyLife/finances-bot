import axios from 'axios';
import * as A from 'fp-ts/Array';
import * as E from 'fp-ts/Either';
import { constUndefined, flow, pipe } from 'fp-ts/function';
import * as TE from 'fp-ts/TaskEither';

import { configuration } from '../configuration';
import { OrderStatus } from '../core/data/orders';
import { connectToWildberries } from './wildberries';

const { wildberriesToken, wildberriesUrl } = configuration;

describe.skip('wildberries', () => {
  it('should be able to get orders', async () => {
    const wildberriesSDK = connectToWildberries(wildberriesUrl, wildberriesToken);

    const orders = await wildberriesSDK.getOrders()();

    expect(E.toUnion(orders)).toEqual(
      expect.arrayContaining([
        {
          currency: 'RUB',
          dateCreated: expect.any(String),
          id: expect.any(String),
          officeAddress: expect.any(String),
          price: expect.any(Number),
          status: OrderStatus.NEW,
        },
      ]),
    );
  });

  it('should be able to change wb order status', async () => {
    const wildberriesSDK = connectToWildberries(wildberriesUrl, wildberriesToken);

    const checkOrderStatusChanged = pipe(
      wildberriesSDK.getOrders(),
      TE.chain(
        flow(
          A.findFirst((o) => o.status === OrderStatus.NEW),
          TE.fromOption(() => new Error(`Couldn't find order in status = ${OrderStatus.NEW}`)),
        ),
      ),
      TE.chain((order) =>
        pipe(
          wildberriesSDK.changeWBOrderStatus(order.id, OrderStatus.IN_WORK),
          TE.chain(wildberriesSDK.getOrders),
          TE.chain(
            flow(
              A.findFirst((o) => o.id === order.id),
              TE.fromOption(() => new Error(`Couldn\'t find same order with id = ${order.id}`)),
            ),
          ),
          TE.chain(
            TE.fromPredicate(
              (o) => o.status === OrderStatus.IN_WORK,
              (o) => new Error(`Status has not been changed. Current = ${o.status}`),
            ),
          ),
          TE.map(constUndefined),
        ),
      ),
    );

    const result = await checkOrderStatusChanged();

    expect(E.toUnion(result)).toBeUndefined();
  });

  // TODO: добавить в device и изменение статуса отдельно не делать
  // связывание с поставкой само изменит статус
  // еще нужен метод создания поставки
  it('should link order to supply', async () => {
    const supplyId = 'WB-GI-22288578';
    const data = {
      orders: ['573598192'],
    };

    const response = await axios.put(`${wildberriesUrl}/supplies/${supplyId}`, data, {
      headers: { Authorization: wildberriesToken },
    });

    expect(response.status).toEqual(200);
  });
});
