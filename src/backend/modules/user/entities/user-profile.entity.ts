import mongoose, { Schema, Document, Model } from 'mongoose';
import { IUser } from './user.entity';
import mongooseAutopopulate from 'mongoose-autopopulate';

export enum UserGenderEnum {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export interface IUserProfile extends Document {
  contact: string;
  gender: UserGenderEnum;

  userId: mongoose.Types.ObjectId | IUser;

  createdAt: Date;
  updatedAt: Date;
}

const UserProfileSchema = new Schema<IUserProfile>(
  {
    contact: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },

    gender: {
      type: String,
      enum: UserGenderEnum,
      default: UserGenderEnum.MALE,
      required: true,
      index: true,
    },

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

UserProfileSchema.plugin(mongooseAutopopulate);

const UserProfileEntity: Model<IUserProfile> =
  mongoose.models.UserProfile ||
  mongoose.model<IUserProfile>('UserProfile', UserProfileSchema);

export default UserProfileEntity;
