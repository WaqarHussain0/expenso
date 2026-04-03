export enum CategoryTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
  INVESTMENT = 'investment',
}

export interface ICategory {
  _id: string;
  name: string;
  type: CategoryTypeEnum;
  icon?:string;
  color?:string;
  createdAt?: Date;
  updatedAt?: Date;
}
