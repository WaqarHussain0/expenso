/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB } from '@/backend/utils/dbInit.util';
import TransactionEntity from './entities/transaction.entity';
import mongoose from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoryService } from '../category/category.service';
import {
  CategoryTypeEnum,
  ICategory,
} from '../category/entities/category.entity';

const categoryService = new CategoryService();

export class TransactionService {
  private readonly transactionEntity = TransactionEntity;

  async findById(id: mongoose.Types.ObjectId) {
    await initDB();

    const data = await this.transactionEntity
      .findById(id)
      .lean({ virtuals: true });

    if (!data) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    return data;
  }

  async create(payload: CreateTransactionDto) {
    const { categoryId } = payload;

    await initDB();

    const category = await categoryService.findById(categoryId);

    if (!category || !category._id) {
      throw new Error(
        `Category with id ${categoryId} does not exists, please use a different category.`,
      );
    }

    return await this.transactionEntity.create({
      ...payload,
      categoryId: new mongoose.Types.ObjectId(categoryId),
    });
  }

  async delete(id: mongoose.Types.ObjectId) {
    await initDB();
    const deletedData = await this.transactionEntity.findByIdAndDelete(id);

    if (!deletedData) {
      throw new Error(`Transaction with id ${id} not found`);
    }

    return deletedData;
  }

  async update(id: mongoose.Types.ObjectId, payload: CreateTransactionDto) {
    const [data, category] = await Promise.all([
      this.findById(id),
      categoryService.findById(payload.categoryId),
    ]);

    if (!category || !category._id) {
      throw new Error(
        `Category with id ${payload.categoryId} does not exists, please use a different category.`,
      );
    }

    if (!data) {
      throw new Error(`Category with id ${id} not found`);
    }

    return await this.transactionEntity.findByIdAndUpdate(
      id,
      payload,
      { new: true }, // return updated document
    );
  }

  async findAll({
    search,
    page = 1,
    limit = 10,
    categoryType,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    categoryType?: CategoryTypeEnum;
  }) {
    await initDB();

    const query: Record<string, any> = {};

    if (search) {
      query['$or'] = [{ note: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * limit;

    let totalRecords = 0;

    // ✅ FIX COUNT
    if (categoryType) {
      const categories = await mongoose
        .model('Category')
        .find({ type: categoryType })
        .select('_id')
        .lean();

      const categoryIds = categories.map(c => c._id);

      totalRecords = await this.transactionEntity.countDocuments({
        ...query,
        categoryId: { $in: categoryIds },
      });
    } else {
      totalRecords = await this.transactionEntity.countDocuments(query);
    }

    const transactions = await this.transactionEntity
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: 'categoryId',
        match: categoryType ? { type: categoryType } : {},
      })
      .lean();

    const filteredTransactions = categoryType
      ? transactions.filter(t => t.categoryId)
      : transactions;

    const data = filteredTransactions.map(item => {
      const category = item.categoryId as ICategory;

      return {
        _id: item._id?.toString(),
        category: {
          _id: category?._id?.toString(),
          name: category?.name,
          type: category?.type,
        },
        categoryId: category?._id?.toString(),
        amount: item.amount,
        date: item.date,
        note: item.note,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return { data, meta: { page, totalRecords, totalPages } };
  }
}
