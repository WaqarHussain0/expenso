import mongoose, { Schema, Document, Model } from 'mongoose';

export enum UserRoleEnum {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRoleEnum;
  password?: string | null;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;

  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    password: { type: String, default: null },
    isActive: { type: Boolean, default: true },

    role: {
      type: String,
      enum: UserRoleEnum,
      default: UserRoleEnum.USER,
      required: true,
      index: true,
    },

    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  },
);

const UserEntity: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default UserEntity;
