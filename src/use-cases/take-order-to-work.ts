import { OrderStatus } from '../core/data/orders';
import { ChangeWBOrderStatus } from './dependencies/wildberries';

export const takeOrderToWorkUsecase = (changeWBOrderStatus: ChangeWBOrderStatus, orderId: string) =>
  changeWBOrderStatus(orderId, OrderStatus.IN_WORK);
