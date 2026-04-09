/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB } from '@/backend/utils/dbInit.util';
import mongoose from 'mongoose';
import UserEntity, { UserRoleEnum } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { after } from 'next/server';
import { sendEmail } from '@/lib/email.util';
import { forgotPasswordEmailTemplate } from '@/app/constants/email-templates/forgot-password.email-template';
import { welcomeEmailTemplate } from '@/app/constants/email-templates/welcome.email-template';
import UserProfileEntity, {
  UserGenderEnum,
} from './entities/user-profile.entity';
import StatEntity from '../stats/entities/stats.entity';
import TransactionEntity from '../transaction/entities/transaction.entity';
import CategoryEntity from '../category/entities/category.entity';

export class UserService {
  private readonly userEntity = UserEntity;
  private readonly statEntity = StatEntity;
  private readonly transactionEntity = TransactionEntity;
  private readonly categoryEntity = CategoryEntity;
  private readonly userProfileEntity = UserProfileEntity;

  async findById(id: string | mongoose.Types.ObjectId) {
    await initDB();

    const data = await this.userEntity.findById(id).lean({ virtuals: true });

    if (!data) {
      throw new Error(`User with id ${id} not found`);
    }

    return data;
  }

  async findByEmail(email: string) {
    await initDB();
    return await this.userEntity.findOne({
      email: email?.trim()?.toLowerCase(),
    });
  }

  async createUser(payload: CreateUserDto) {
    const { name, email, password, role } = payload;

    await initDB();

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new Error(
        `User with email ${email} already exists, please use a different email.`,
      );
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const savedUser = await this.userEntity.create({
      name,
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: role || UserRoleEnum.USER,
      isFirstLogin: true,
    });

    const loginPageLink = `${process.env.NEXTAUTH_URL}/login}`;

    // prepare email template
    const html = welcomeEmailTemplate({
      name: savedUser?.name || 'there',
      loginPageLink,
    });

    after(async () => {
      await sendEmail({
        to: savedUser?.email,
        subject: 'Welcome to Expenso',
        html,
      });
    });

    return savedUser;
  }

  async deleteUser(id: string) {
    await initDB();
    const user = await this.findById(id);
    return await this.userEntity.findByIdAndUpdate(
      id,
      { isActive: !user.isActive },
      { new: true },
    );
  }

  async saveUserResetToken(id: mongoose.Types.ObjectId, resetToken: string) {
    // Hash token before saving
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    return await this.userEntity.findByIdAndUpdate(
      id,
      {
        resetPasswordToken: hashedToken,
        resetPasswordExpires: new Date(Date.now() + 15 * 60 * 1000),
      },
      { new: true },
    ); // return updated document
  }

  async forgotPassword(email: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new Error('Please enter a valid email address');
    }

    // Delete existing reset token (if exists)
    await this.userEntity.findByIdAndUpdate(
      user._id,
      { resetPasswordToken: null, resetPasswordExpires: null },
      { new: true },
    ); // return updated document

    //  Generate raw token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Save new token + expiry (15 minutes)
    await this.saveUserResetToken(user._id, resetToken);

    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // prepare email template
    const html = forgotPasswordEmailTemplate({
      name: user?.name || 'there',
      resetPasswordLink: resetLink,
    });

    after(async () => {
      await sendEmail({
        to: user?.email,
        subject: 'Password Reset Request',
        html,
      });
    });

    return {
      message: 'Reset link sent to your email, please check your inbox',
    };
  }

  async findByResetPasswordToken(token: string) {
    await initDB();
    return await this.userEntity.findOne({ resetPasswordToken: token });
  }

  async resetPasswordByToken(token: string, password: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.findByResetPasswordToken(hashedToken);

    if (!user || !user._id) {
      throw new Error('Invalid or expired token');
    }

    if (user.resetPasswordExpires && user.resetPasswordExpires < new Date()) {
      throw new Error('Token expired');
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    await this.userEntity.findByIdAndUpdate(
      user._id,
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      {
        new: true,
      },
    );

    return {
      message: 'Password reset successfully',
    };
  }

  async findAll({
    search,
    page = 1,
    limit = 10,
    gender,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    gender?: UserGenderEnum;
  }) {
    await initDB();

    const matchQuery: Record<string, any> = {
      role: UserRoleEnum.USER,
    };

    if (search) {
      matchQuery['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const query: Record<string, any> = {
      // _id: { $ne: new mongoose.Types.ObjectId(userId) }, // exclude logged-in user
    };

    if (search) {
      query['$or'] = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const limitRecords = limit;

    const aggregationPipeline: any[] = [
      { $match: matchQuery },

      // join with profile
      {
        $lookup: {
          from: 'userprofiles', // collection name in MongoDB
          localField: '_id',
          foreignField: 'userId',
          as: 'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
    ];

    // Apply gender filter if provided
    if (gender) {
      aggregationPipeline.push({
        $match: { 'profile.gender': gender },
      });
    }

    // Count total after filters
    const totalRecordsAgg = await this.userEntity.aggregate([
      ...aggregationPipeline,
      { $count: 'total' },
    ]);
    const totalRecords = totalRecordsAgg[0]?.total || 0;

    // Pagination
    aggregationPipeline.push({ $sort: { createdAt: -1 } });
    aggregationPipeline.push({ $skip: skip });
    aggregationPipeline.push({ $limit: limitRecords });

    // ✅ FIX COUNT
    // Fetch data
    const users = await this.userEntity.aggregate(aggregationPipeline);

    // Map data
    const data = users.map(item => ({
      id: item._id.toString(),
      name: item.name,
      email: item.email,
      role: item.role,
      profile: {
        _id: item.profile?._id?.toString() || '',
        gender: item.profile?.gender || null,
        contact: item.profile?.contact || '',
      },
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    const totalPages = Math.ceil(totalRecords / limit);

    return { data, meta: { page, totalRecords, totalPages } };
  }

  async getUserStats() {
    await initDB();

    const stats = await mongoose.model('User').aggregate([
      {
        $group: {
          _id: '$role',
          total: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalAdmin: 0,
      normalUsers: 0,
    };

    stats.forEach(item => {
      if (item._id === UserRoleEnum.ADMIN) {
        result.totalAdmin = item.total;
      }

      if (item._id === UserRoleEnum.USER) {
        result.normalUsers = item.total;
      }
    });

    return result;
  }

  async isFirstLogin(userId: string) {
    const user = await this.findById(userId);

    return user.isFirstLogin;
  }

  async update(userId: mongoose.Types.ObjectId) {
    return await this.userEntity.findByIdAndUpdate(
      userId,
      {
        isFirstLogin: false,
      },
      {
        new: true,
      },
    );
  }

  async delete(id: mongoose.Types.ObjectId) {
    await initDB();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await this.userEntity.findById(id).session(session);
      if (!user) throw new Error('User not found');
      await this.userEntity.findByIdAndDelete(user._id, { session });

      await Promise.all([
        this.categoryEntity.deleteMany({ userId: user._id }, { session }),
        this.transactionEntity.deleteMany({ userId: user._id }, { session }),
        this.statEntity.deleteMany({ userId: user._id }, { session }),
        this.userProfileEntity.deleteOne({ userId: user._id }, { session }),
      ]);

      await session.commitTransaction();

      return {
        success: true,
        message: 'User and associated data deleted successfully!',
      };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  }
}
