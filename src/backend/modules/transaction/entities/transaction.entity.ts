import mongoose, { Schema, Document, Model } from "mongoose";

export enum TransactionTypeEnum {
  INCOME = "income",
  EXPENSE = "expense",
}

export interface ITransaction extends Document {
  type: TransactionTypeEnum;
  categoryId: mongoose.Types.ObjectId;
  amount: number;
  date: Date;
  note?: string;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    type: {
      type: String,
      enum: TransactionTypeEnum,
      default: TransactionTypeEnum.INCOME,
      required: true,
      index: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    date: {
      type: Date,
      required: true,
    },

    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

const TransactionEntity: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);

export default TransactionEntity;
