import mongoose, { Schema, Document, Model } from 'mongoose';
import mongooseAutopopulate from 'mongoose-autopopulate';
import { IUser } from '../../user/entities/user.entity';

export interface IStat extends Document {
  token: string;
  filter: {
    type: string; // 'month' | 'year' | 'custom'
    startDate?: Date;
    endDate?: Date;
    year?: number;
  };

  userId: mongoose.Types.ObjectId | IUser;

  createdAt: Date;
  updatedAt: Date;
}

const StatsSchema = new Schema<IStat>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true, // ✅ must have owner
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    filter: {
      type: {
        type: String,
        required: true,
      },
      startDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
      year: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
  },
);

StatsSchema.plugin(mongooseAutopopulate);

const StatEntity: Model<IStat> =
  mongoose.models.Stat || mongoose.model<IStat>('Stat', StatsSchema);

export default StatEntity;
