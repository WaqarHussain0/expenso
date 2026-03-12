export interface ITransaction {
  _id: string;
  categoryId: string;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
