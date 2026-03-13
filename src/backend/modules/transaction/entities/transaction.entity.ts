import mongoose, { Schema, Document, Model } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import { ICategory } from '../../category/entities/category.entity';

export interface ITransaction extends Document {
  categoryId: mongoose.Types.ObjectId | ICategory;
  amount: number;
  date: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
      index: true,
      autopopulate: true,
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

TransactionSchema.plugin(mongooseAutopopulate);

const TransactionEntity: Model<ITransaction> =
  mongoose.models.Transaction ||
  mongoose.model<ITransaction>('Transaction', TransactionSchema);

export default TransactionEntity;
