import mongoose, { Schema, Document, Model } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import { ICategory } from '../../category/entities/category.entity';
import { IUser } from '../../user/entities/user.entity';

export interface ITransaction extends Document {
  amount: number;
  date: Date;
  note?: string;

  categoryId: mongoose.Types.ObjectId | ICategory;
  userId: mongoose.Types.ObjectId | IUser;

  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
      default: null,
      index: true,
      autopopulate: true,
    },

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
