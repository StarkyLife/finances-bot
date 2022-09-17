import axios from 'axios';

import { configuration } from '../configuration';

describe('wildberries', () => {
  it('should be able to get orders', async () => {
    const key = configuration.wildberriesKey;
    const dateFrom = '2022-09-16T00:00:00Z';

    const params = new URLSearchParams({
      date_start: dateFrom,
      take: '10',
      skip: '0',
    });

    const response = await axios.get(
      `https://suppliers-api.wildberries.ru/api/v2/orders?${params.toString()}`,
      {
        headers: {
          Authorization: key,
        },
      },
    );

    expect(response.data).toEqual({
      orders: [
        {
          barcode: '2036760929907',
          barcodes: ['2036760929907'],
          chrtId: 153712244,
          convertedPrice: 135300,
          currencyCode: 643,
          dateCreated: '2022-09-16T17:21:27.976849Z',
          deliveryAddress: '',
          deliveryAddressDetails: {
            area: '',
            city: '',
            entrance: '',
            flat: '',
            home: '',
            latitude: 0,
            longitude: 0,
            province: '',
            street: '',
          },
          deliveryType: 1,
          officeAddress: 'г Москва (Россия), Большой Казенный переулок, д. 10с2',
          orderId: '435152278',
          orderUID: '85127379_d90c477920b84a2b83fe494b2120cea3',
          pid: 106009,
          rid: 'ef5b70471656461191d039317ba7a0c6',
          scOfficesNames: ['Склад Коледино'],
          status: 1,
          storeId: 275416,
          totalPrice: 135300,
          userInfo: { email: '', fio: '', phone: 0 },
          userStatus: 4,
          wbWhId: 119408,
        },
      ],
      total: 1,
    });
  });
});
