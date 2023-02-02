export type WildberriesOrdersResponse = {
  orders: Array<{
    id: string; // 13833711
    createdAt: string; // 2021-02-20T16:50:33.365+03:00
    article: string; // one-ring-7548
    convertedPrice: number; // 5600
    address: {
      province?: string;
      area?: string;
      city?: string;
      street?: string;
      home?: string;
    };
  }>;
};
