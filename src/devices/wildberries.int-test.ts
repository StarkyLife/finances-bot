import axios from 'axios';
import * as E from 'fp-ts/Either';

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
