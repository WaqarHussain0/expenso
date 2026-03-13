import { ICategory } from "./category.type";

export interface ITransaction {
  _id: string;
  categoryId: string;
  category:ICategory;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}
