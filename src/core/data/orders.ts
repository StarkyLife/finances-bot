export type WBOrder = {
  id: string;
  dateCreated: string;
  officeAddress: string;
  currency: string;
  price: number;
};

export type OrderPresentation = {
  id: string;
  dateCreated: string;
  officeAddress: string;
  price: string;
};
