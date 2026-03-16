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

  async create(payload: CreateTransactionDto, userId: mongoose.Types.ObjectId) {
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
      userId,
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
    userId,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    categoryType?: CategoryTypeEnum;
    userId: string;
  }) {
    await initDB();

    const query: Record<string, any> = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    // Add search filter
    if (search) {
      query['$or'] = [{ note: { $regex: search, $options: 'i' } }];
    }

    // If filtering by categoryType (income/expense/investment)
    if (categoryType) {
      // 1️⃣ Find category IDs with that type
      const categories = await mongoose
        .model('Category')
        .find({ type: categoryType, userId: userId })
        .select('_id')
        .lean();

      const categoryIds = categories.map(c => c._id);

      // 2️⃣ Filter transactions by these category IDs
      query['categoryId'] = { $in: categoryIds };
    }

    const skip = (page - 1) * limit;

    const totalRecords = await this.transactionEntity.countDocuments(query);

    const transactions = await this.transactionEntity
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: 'categoryId',
        select: '_id name type', // populate only relevant fields
      })
      .lean();

    const data = transactions.map(item => {
      const category = item.categoryId as ICategory;

      return {
        _id: item._id?.toString(),
        category: {
          _id: category._id?.toString(),
          name: category.name,
          type: category.type,
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

  // get month stats for income, expense and investment
  async getMonthlyStats(month: number, year: number) {
    await initDB();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const stats = await this.transactionEntity.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      {
        $unwind: '$category',
      },
      {
        $group: {
          _id: '$category.type',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const result = {
      income: 0,
      expense: 0,
      investment: 0,
    };

    stats.forEach(item => {
      if (item._id === CategoryTypeEnum.INCOME) {
        result.income = item.total;
      }

      if (item._id === CategoryTypeEnum.EXPENSE) {
        result.expense = item.total;
      }

      if (item._id === CategoryTypeEnum.INVESTMENT) {
        result.investment = item.total;
      }
    });

    return result;
  }

  async getDashboardData(
    startDate: Date,
    endDate: Date,
    userId: mongoose.Types.ObjectId,
  ) {
    await initDB();

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const matchStage = {
      $match: {
        userId,
        date: { $gte: startDate, $lte: end },
      },
    };

    // existing daily series aggregation
    const stats = await this.transactionEntity.aggregate([
      matchStage,
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: {
            type: '$category.type',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);

    // new — group by category name + type
    const categoryStats = await this.transactionEntity.aggregate([
      matchStage,
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      {
        $group: {
          _id: {
            categoryId: '$categoryId',
            name: '$category.name',
            type: '$category.type',
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { total: -1 } },
    ]);

    const chartData: Record<
      string,
      { date: string; income: number; expense: number; investment: number }
    > = {};

    stats.forEach(item => {
      const { type, date } = item._id;
      if (!chartData[date])
        chartData[date] = { date, income: 0, expense: 0, investment: 0 };
      if (type === CategoryTypeEnum.INCOME) chartData[date].income = item.total;
      if (type === CategoryTypeEnum.EXPENSE)
        chartData[date].expense = item.total;
      if (type === CategoryTypeEnum.INVESTMENT)
        chartData[date].investment = item.total;
    });

    const series = Object.values(chartData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );

    const totals = series.reduce(
      (acc, day) => {
        acc.income += day.income;
        acc.expense += day.expense;
        acc.investment += day.investment;
        return acc;
      },
      { income: 0, expense: 0, investment: 0 },
    );

    // shape category breakdown by type
    const categoryBreakdown = {
      income: categoryStats
        .filter(c => c._id.type === CategoryTypeEnum.INCOME)
        .map(c => ({ name: c._id.name, total: c.total })),
      expense: categoryStats
        .filter(c => c._id.type === CategoryTypeEnum.EXPENSE)
        .map(c => ({ name: c._id.name, total: c.total })),
      investment: categoryStats
        .filter(c => c._id.type === CategoryTypeEnum.INVESTMENT)
        .map(c => ({ name: c._id.name, total: c.total })),
    };

    return { series, totals, categoryBreakdown };
  }
}
