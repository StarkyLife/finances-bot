import { OrderStatus } from '../../core/data/orders';

export type WildberriesOrdersResponse = {
  total: number;
  orders: Array<{
    orderId: string; // 13833711
    dateCreated: string; // 2021-02-20T16:50:33.365+03:00
    convertedPrice: number; // 5600
    officeAddress: string; // г Ставрополь (Ставропольский край), Ленина 482/1
    status: OrderStatus; // 0
  }>;
};
