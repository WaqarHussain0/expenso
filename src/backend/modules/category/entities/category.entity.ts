import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from '../../user/entities/user.entity';
import mongooseAutopopulate from 'mongoose-autopopulate';

export enum CategoryTypeEnum {
  INCOME = 'income',
  EXPENSE = 'expense',
  INVESTMENT = 'investment',
}

export interface ICategory extends Document {
  name: string;
  type: CategoryTypeEnum;
  createdAt: Date;
  updatedAt: Date;
  isActive?: boolean;
  icon?: string;
  color?: string;

  userId: mongoose.Types.ObjectId | IUser;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    icon: {
      type: String,
      required: false,
      trim: true,
    },

    color: {
      type: String,
      required: false,
      trim: true,
    },

    type: {
      type: String,
      enum: CategoryTypeEnum,
      default: CategoryTypeEnum.EXPENSE,
      required: true,
      index: true,
    },

    isActive: { type: Boolean, default: true },

    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
      autopopulate: true,
    },
  },
  {
    timestamps: true,
  },
);

CategorySchema.plugin(mongooseAutopopulate);

const CategoryEntity: Model<ICategory> =
  mongoose.models.Category ||
  mongoose.model<ICategory>('Category', CategorySchema);

export default CategoryEntity;
