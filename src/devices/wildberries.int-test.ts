import { configuration } from '../configuration';
import { connectToWildberries } from './wildberries';

describe('wildberries', () => {
  it('should be able to get orders', async () => {
    const token = configuration.wildberriesToken;
    const wildberriesSDK = connectToWildberries(token);

    const orders = await wildberriesSDK.getOrders();

    expect(orders).toEqual(
      expect.arrayContaining([
        {
          currency: 'RUB',
          dateCreated: expect.any(String),
          id: expect.any(String),
          officeAddress: expect.any(String),
          price: expect.any(Number),
        },
      ]),
    );
  });
});
