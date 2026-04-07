import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUserProfile } from './user-profile.entity';

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
  isFirstLogin?: boolean;
  createdAt: Date;
  updatedAt: Date;

  profile?: IUserProfile;

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
    isFirstLogin: { type: Boolean, default: false },

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

UserSchema.virtual('profile', {
  ref: 'UserProfile',
  localField: '_id',
  foreignField: 'userId',
  justOne: true, // because 1 user → 1 profile
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

const UserEntity: Model<IUser> = mongoose.models.User
  ? mongoose.model<IUser>('User')
  : mongoose.model<IUser>('User', UserSchema);

export default UserEntity;
