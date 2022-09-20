export type WildberriesOrdersResponse = {
  total: number;
  orders: Array<{
    orderId: string;
    dateCreated: string;
    convertedPrice: number;
    officeAddress: string;
  }>;
};
