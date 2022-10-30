import axios from 'axios';

import { botController } from '../src/ui/bot-controller';

const mockServerURL = {
  status: 'http://mockserver:1080/mockserver/status',
  expectation: 'http://mockserver:1080/mockserver/expectation',
};

const USER_ID = 'StarkyLife';

const mockWildberriesEndpoint = async (options: {
  path: string;
  method: string;
  response: unknown;
}) => {
  await axios.put(mockServerURL.expectation, {
    httpRequest: {
      method: options.method,
      path: options.path,
    },
    httpResponse: {
      body: JSON.stringify(options.response),
    },
  });
};

it.skip('should notify about new users', async () => {
  await mockWildberriesEndpoint({
    path: '/orders',
    method: 'GET',
    response: {
      total: 1,
      orders: [
        {
          orderId: 'testOrderId',
          dateCreated: '2021-02-20T16:50:33.365+03:00',
          convertedPrice: 5600,
          officeAddress: 'г Ставрополь (Ставропольский край), Ленина 482/1',
          status: 0,
        },
      ],
    },
  });

  await botController.rememberUserChat(USER_ID, 'testChatId')();

  const messages = await botController.checkWBNotifications()();

  expect(messages).toEqual([
    {
      chatId: 'testChatId',
      markdownText: [
        `*Номер заказа* - testOrderId`,
        `*Дата создания* - 20.02.2021 16:50`,
        `*Пункт назначения* - г Ставрополь (Ставропольский край), Ленина 482/1`,
        `*Цена* - 56 RUB`,
      ].join('\n'),
      actions: [
        {
          text: 'Взять в работу',
          data: 'testOrderId',
        },
      ],
    },
  ]);
});
