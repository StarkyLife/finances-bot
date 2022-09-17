import { OrderStatus, WBOrder } from '../../core/data/orders';

export type GetOrdersFromWildberries = (status: OrderStatus) => Promise<WBOrder[]>;
