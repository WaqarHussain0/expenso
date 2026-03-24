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

  // get month stats for income, expense and investment
  async getMonthlyStats(userId: string) {
    const userMongoObjectId = new mongoose.Types.ObjectId(userId);

    await initDB();

    const stats = await this.transactionEntity.aggregate([
      {
        $match: {
          userId: userMongoObjectId,
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

  /**
   * Fetch all transactions within date range (with category populated)
   */
  private async getTransactions(
    startDate: Date,
    endDate: Date,
    userId: mongoose.Types.ObjectId,
  ) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const transactions = await this.transactionEntity
      .find({
        userId,
        date: { $gte: startDate, $lte: end },
      })
      .sort({ date: -1 })
      .populate({
        path: 'categoryId',
        select: '_id name type',
      })
      .lean();

    return transactions.map(item => {
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
  }

  /**
   * Splits transactions into income / expense / investment arrays
   */
  private splitTransactionsByType(transactions: any[]) {
    return {
      income: transactions.filter(
        t => t.category.type === CategoryTypeEnum.INCOME,
      ),
      expense: transactions.filter(
        t => t.category.type === CategoryTypeEnum.EXPENSE,
      ),
      investment: transactions.filter(
        t => t.category.type === CategoryTypeEnum.INVESTMENT,
      ),
    };
  }

  /**
   * Builds MongoDB match stage with date range + user filter
   */
  private buildMatchStage(
    startDate: Date,
    endDate: Date,
    userId: mongoose.Types.ObjectId,
  ) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    return {
      $match: {
        userId,
        date: { $gte: startDate, $lte: end },
      },
    };
  }

  /**
   * Aggregates transactions into daily grouped stats by type
   * Output: [{ _id: { type, date }, total }]
   */
  private async getDailyStats(matchStage: any) {
    return await this.transactionEntity.aggregate([
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
            date: {
              $dateToString: { format: '%Y-%m-%d', date: '$date' },
            },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.date': 1 } },
    ]);
  }

  /**
   * Aggregates total amount grouped by category (name + type)
   * Output: [{ _id: { name, type }, total }]
   */
  private async getCategoryStats(matchStage: any) {
    return await this.transactionEntity.aggregate([
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
  }

  /**
   * Converts raw aggregation into chart-friendly structure
   * Output:
   * [
   *   { date, income, expense, investment }
   * ]
   */
  private buildChartSeries(stats: any[]) {
    const chartData: Record<
      string,
      { date: string; income: number; expense: number; investment: number }
    > = {};

    stats.forEach(item => {
      const { type, date } = item._id;

      if (!chartData[date]) {
        chartData[date] = {
          date,
          income: 0,
          expense: 0,
          investment: 0,
        };
      }

      if (type === CategoryTypeEnum.INCOME) chartData[date].income = item.total;

      if (type === CategoryTypeEnum.EXPENSE)
        chartData[date].expense = item.total;

      if (type === CategoryTypeEnum.INVESTMENT)
        chartData[date].investment = item.total;
    });

    return Object.values(chartData).sort((a, b) =>
      a.date.localeCompare(b.date),
    );
  }

  /**
   * Calculates total sums from chart series
   */
  private calculateTotals(series: any[]) {
    return series.reduce(
      (acc, day) => {
        acc.income += day.income;
        acc.expense += day.expense;
        acc.investment += day.investment;
        return acc;
      },
      { income: 0, expense: 0, investment: 0 },
    );
  }

  /**
   * Groups category stats into income/expense/investment buckets
   */
  private buildCategoryBreakdown(categoryStats: any[]) {
    return {
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
  }

  async getMonthlyDashboardData(
    startDate: Date,
    endDate: Date,
    userId: mongoose.Types.ObjectId,
  ) {
    await initDB();

    const matchStage = this.buildMatchStage(startDate, endDate, userId);

    // 1️⃣ dailyStats - Get time-series stats (for charts)

    // 2️⃣ categoryStats - Get category breakdown (for pie charts / insights)

    const [dailyStats, categoryStats, transactions] = await Promise.all([
      this.getDailyStats(matchStage),
      this.getCategoryStats(matchStage),
      this.getTransactions(startDate, endDate, userId),
    ]);

    // 3️⃣ Transform daily stats into chart-friendly format
    const series = this.buildChartSeries(dailyStats);

    // 4️⃣ Calculate totals (income, expense, investment)
    const totals = this.calculateTotals(series);

    // 5️⃣ Structure category breakdown by type
    const categoryBreakdown = this.buildCategoryBreakdown(categoryStats);

    // Split transactions
    const monthAllTransactions = this.splitTransactionsByType(transactions);

    return { series, totals, categoryBreakdown, monthAllTransactions };
  }

  async getYearlyDashboardData(userId: mongoose.Types.ObjectId, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await TransactionEntity.find({
      userId,
      date: { $gte: startDate, $lte: endDate },
    });

    // ── 1. Totals (for cards) ────────────────────────────────────
    const totals = { income: 0, expense: 0, investment: 0 };

    // ── 2. Monthly series - 12 points for line chart ─────────────
    // Pre-fill all 12 months so every month appears even with no transactions
    const MONTH_NAMES = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const monthlySeriesMap = new Map<
      number,
      {
        month: string;
        income: number;
        expense: number;
        investment: number;
        freeCash: number;
      }
    >();

    for (let m = 0; m < 12; m++) {
      monthlySeriesMap.set(m, {
        month: MONTH_NAMES[m],
        income: 0,
        expense: 0,
        investment: 0,
        freeCash: 0,
      });
    }

    // ── 3. Expense category breakdown (for expense graph) ────────
    const expenseCategoryMap = new Map<string, number>();

    for (const tx of transactions) {
      const category = tx.categoryId as ICategory;
      const type = category.type as CategoryTypeEnum;
      const month = tx.date.getMonth(); // 0-11

      // totals
      totals[type] += tx.amount;

      // monthly series
      monthlySeriesMap.get(month)![type] += tx.amount;

      // expense category breakdown
      if (type === CategoryTypeEnum.EXPENSE) {
        expenseCategoryMap.set(
          category.name,
          (expenseCategoryMap.get(category.name) ?? 0) + tx.amount,
        );
      }
    }

    return {
      // 1. Cards
      totals,

      // 2. Line chart — 12 months, 3 lines
      monthlySeries: [...monthlySeriesMap.values()].map(m => ({
        ...m,
        freeCash: m.income - (m.expense + m.investment),
      })),

      // 3. Expense graph — one entry per expense category
      expenseBreakdown: [...expenseCategoryMap.entries()]
        .map(([name, total]) => ({ name, total }))
        .sort((a, b) => b.total - a.total), // highest first
    };
  }

  async getCustomDateDashboardData(
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
  ) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const transactions = await TransactionEntity.find({
      userId,
      date: { $gte: start, $lte: end },
    });

    const totals = { income: 0, expense: 0, investment: 0, freeCash: 0 };
    const counts = { income: 0, expense: 0, investment: 0 };
    const expenseCategoryMap = new Map<string, number>();

    for (const tx of transactions) {
      const category = tx.categoryId as ICategory;
      const type = category.type as CategoryTypeEnum;

      totals[type] += tx.amount;
      counts[type]++;

      if (type === CategoryTypeEnum.EXPENSE) {
        expenseCategoryMap.set(
          category.name,
          (expenseCategoryMap.get(category.name) ?? 0) + tx.amount,
        );
      }
    }

    totals.freeCash = totals.income - (totals.expense + totals.investment);

    const expenseBreakdown = [...expenseCategoryMap.entries()]
      .map(([name, total]) => ({ name, total }))
      .sort((a, b) => b.total - a.total);

    return {
      totals,
      counts,
      savingsRate:
        totals.income > 0
          ? Math.round(((totals.income - totals.expense) / totals.income) * 100)
          : 0,
      topExpenseCategory: expenseBreakdown[0] ?? null,
      expenseBreakdown,
    };
  }
}
