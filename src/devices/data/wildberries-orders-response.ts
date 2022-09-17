export type WildberriesOrdersResponse = {
  total: number;
  orders: Array<{
    orderId: string;

    // vendor code (артикул)
    chrtId: number;

    dateCreated: string;
    convertedPrice: number;
    officeAddress: string;
  }>;
};
