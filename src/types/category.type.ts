export enum CategoryTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
  INVESTMENT = 'investment',
}

export interface ICategory {
  _id: string;
  name: string;
  type: CategoryTypeEnum;
  createdAt?: Date;
  updatedAt?: Date;
}
