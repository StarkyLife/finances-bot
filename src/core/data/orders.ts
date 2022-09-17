export type OrderStatus = 'any' | 'new';

export type WBOrder = {
  id: string;
  dateCreated: string;
  officeAddress: string;
  currency: string;
  totalPrice: number;
};

export type OrderPresentation = {
  id: string;
  dateCreated: string;
  officeAddress: string;
  price: string;
};
