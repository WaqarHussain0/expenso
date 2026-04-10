/* eslint-disable @typescript-eslint/no-explicit-any */
import mongoose from 'mongoose';
import CategoryEntity from '../modules/category/entities/category.entity';
import TransactionEntity from '../modules/transaction/entities/transaction.entity';
import UserEntity from '../modules/user/entities/user.entity';
import StatEntity from '../modules/stats/entities/stats.entity';
import UserProfileEntity from '../modules/user/entities/user-profile.entity';

/**
 * Global is used to maintain a cached connection across hot reloads in development
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

// All your models go here
const models = {
  Category: CategoryEntity,
  Transaction: TransactionEntity,
  User: UserEntity,
  Stat: StatEntity,
  UserProfile: UserProfileEntity,
};

async function connectToDB() {
  const MONGODB_URI =
    process.env.MONGODB_URI || 'mongodb://localhost:27017/expenso';

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      })
      .then(async mongooseInstance => {
        console.log('MongoDB connected ✅');

        // Sync indexes for all models
        if (process.env.NODE_ENV === 'development') {
          await Promise.all(
            Object.values(models).map(model => model?.syncIndexes()),
          );
          console.log('All model indexes synced ✅');
        }

        return mongooseInstance;
      })
      .catch(err => {
        cached.promise = null; // allow retry on next call
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDB;
