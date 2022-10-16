import { OrderStatus } from '../../core/data/orders';

export type WildberriesOrdersResponse = {
  total: number;
  orders: Array<{
    orderId: string;
    dateCreated: string;
    convertedPrice: number;
    officeAddress: string;
    status: OrderStatus;
  }>;
};
