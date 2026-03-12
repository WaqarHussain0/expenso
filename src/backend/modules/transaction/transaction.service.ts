import { initDB } from '@/backend/utils/dbInit.util';
import TransactionEntity from './entities/transaction.entity';
import mongoose from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CategoryService } from '../category/category.service';

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

    return await this.transactionEntity.create(payload);
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
    isServerSide = false,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    isServerSide: boolean;
  }) {
    await initDB(isServerSide);

    const query: Record<string, any> = {};

    if (search) {
      query['$or'] = [{ notes: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * limit;
    const totalRecords = await this.transactionEntity.countDocuments(query);

    const transactions = await this.transactionEntity
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const data = transactions?.map(item => {
      return {
        _id: item._id?.toString(),
        categoryId: item.categoryId?.toString(),
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
