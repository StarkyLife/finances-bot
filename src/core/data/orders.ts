export enum OrderStatus {
  NEW = 0,
  IN_WORK = 1,
}

export type WBOrder = {
  id: string;
  dateCreated: string;
  officeAddress: string;
  currency: string;
  price: number;
  article: string;
};

export type OrderPresentation = {
  id: string;
  dateCreated: string;
  officeAddress: string;
  price: string;
  article: string;
};
