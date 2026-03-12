import mongoose, { Schema, Document, Model } from "mongoose";

export enum CategoryTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
  INVESTMENT = "investment",
}

export interface ICategory extends Document {
  name: string;
  type: CategoryTypeEnum;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: CategoryTypeEnum,
      default: CategoryTypeEnum.EXPENSE,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

const CategoryEntity: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default CategoryEntity;
