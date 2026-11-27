/* eslint-disable @typescript-eslint/no-explicit-any */
import { initDB } from '@/backend/utils/dbInit.util';
import CategoryEntity, { CategoryTypeEnum } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import mongoose from 'mongoose';
import { UserService } from '../user/user.service';
import {
  CATEGORY_COLORS,
  DEFAULT_CATEGORY_ICON,
} from '@/app/constants/app.constant';
import {
  CATEGORY_EXPORT_MAX_ROWS,
  MAX_CATEGORIES_PER_USER,
} from '../rate-limit/limits.constant';

/** The import would take the user past MAX_CATEGORIES_PER_USER. */
export class CategoryLimitError extends Error {
  name = 'CategoryLimitError';
}

export interface ICategoryImportRow {
  /** Lowercased, trimmed */
  name: string;
  type: CategoryTypeEnum;
  /** Hex colour, or undefined to keep the current one / pick a default */
  color?: string;
}

export interface ICategoryImportResult {
  created: number;
  updated: number;
  /** Previously deleted categories brought back */
  restored: number;
  unchanged: number;
}

const userService = new UserService();
export class CategoryService {
  private readonly categoryEntity = CategoryEntity;

  /**
   * @param userId when given, only a category owned by this user is returned
   */
  async findById(
    id: string | mongoose.Types.ObjectId,
    userId?: mongoose.Types.ObjectId,
  ) {
    await initDB();

    const data = await this.categoryEntity
      .findOne({ _id: id, ...(userId && { userId }) })
      .lean({ virtuals: true });

    if (!data) {
      throw new Error(`Category with id ${id} not found`);
    }

    return data;
  }

  async findByNameUserAndType(
    name: string,
    userId: mongoose.Types.ObjectId,
    type: CategoryTypeEnum,
  ) {
    await initDB();

    return await this.categoryEntity.findOne({
      name: name.trim().toLowerCase(),
      userId,
      type,
    });
  }

  async create(payload: CreateCategoryDto, userId: mongoose.Types.ObjectId) {
    const { name, type, color, icon } = payload;

    await initDB();

    const existingData = await this.findByNameUserAndType(name, userId, type);

    if (existingData) {
      // If it exists but is inactive, reactivate it
      if (!existingData.isActive) {
        return await this.categoryEntity.findByIdAndUpdate(
          existingData._id,
          { $set: { isActive: true, color, icon } },
          { new: true },
        );
      }

      // If it exists and is active, throw as before
      throw new Error(
        `Category with name ${name} already exists, please use a different name.`,
      );
    }

    const saved = await this.categoryEntity.create({
      name,
      type,
      userId,
      color,
      icon,
    });

    return saved;
  }

  async findAll({
    search,
    page = 1,
    limit = 10,
    type,
    userId,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    type: CategoryTypeEnum | undefined;
    userId: string;
  }) {
    await initDB();

    const query: Record<string, any> = {
      userId: new mongoose.Types.ObjectId(userId),
      isActive: true,
    };

    // ✅ add type filter
    if (type) {
      query.type = type;
    }

    if (search) {
      query['$or'] = [{ name: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * limit;
    const [totalRecords, categories] = await Promise.all([
      this.categoryEntity.countDocuments(query),
      this.categoryEntity
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
    ]);

    const data = categories?.map(item => {
      return {
        name: item.name,
        type: item.type,
        icon: item.icon,
        color: item.color,
        _id: item._id?.toString(),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return { data, meta: { page, totalRecords, totalPages } };
  }

  async delete(id: mongoose.Types.ObjectId, userId: mongoose.Types.ObjectId) {
    await initDB();
    // Scoped to the owner — another user's id simply isn't found
    const deletedData = await this.categoryEntity.findOneAndUpdate(
      { _id: id, userId },
      {
        isActive: false,
      },
      { new: true }, // return updated document
    );

    if (!deletedData) {
      throw new Error(`Category with id ${id} not found`);
    }

    return {
      success: true,
      message: 'Category deleted successfully!',
    };
  }

  async update(
    id: mongoose.Types.ObjectId,
    payload: CreateCategoryDto,
    userId: mongoose.Types.ObjectId,
  ) {
    const { name, type, color, icon } = payload;

    const [data, existingName] = await Promise.all([
      this.findById(id, userId),
      this.findByNameUserAndType(name, userId, type),
    ]);

    if (!data) {
      throw new Error(`Category with id ${id} not found`);
    }

    if (existingName && existingName._id.toString() !== id.toString()) {
      throw new Error(
        `Category with name ${payload.name} already exists, please use a different name.`,
      );
    }

    return await this.categoryEntity.findOneAndUpdate(
      { _id: id, userId },
      { name, type, color, icon },
      { new: true }, // return updated document
    );
  }

  /**
   * Create-or-update categories from an import, matched by name + type:
   * - no match → created (default icon; given colour or one from the palette)
   * - deleted match → restored (and recoloured if a colour is given)
   * - active match with a different colour → colour updated
   * - active match otherwise → left unchanged
   * Rows must already be validated and free of duplicates.
   */
  async importMany(
    userId: mongoose.Types.ObjectId,
    rows: ICategoryImportRow[],
  ): Promise<ICategoryImportResult> {
    await initDB();

    const existing = await this.categoryEntity
      .find({ userId, name: { $in: rows.map(row => row.name) } })
      .select('_id name type color isActive')
      .lean();

    // If the same name + type exists more than once, prefer the active one
    const byKey = new Map<string, (typeof existing)[number]>();
    for (const category of existing) {
      const key = `${category.name}|${category.type}`;
      const current = byKey.get(key);
      if (!current || (!current.isActive && category.isActive)) {
        byKey.set(key, category);
      }
    }

    const result: ICategoryImportResult = {
      created: 0,
      updated: 0,
      restored: 0,
      unchanged: 0,
    };
    const operations: mongoose.AnyBulkWriteOperation[] = [];

    rows.forEach((row, index) => {
      const match = byKey.get(`${row.name}|${row.type}`);

      if (!match) {
        result.created++;
        operations.push({
          insertOne: {
            document: {
              name: row.name,
              type: row.type,
              userId,
              icon: DEFAULT_CATEGORY_ICON,
              color:
                row.color ?? CATEGORY_COLORS[index % CATEGORY_COLORS.length],
              isActive: true,
            },
          },
        });
        return;
      }

      const recolour =
        !!row.color && row.color.toLowerCase() !== match.color?.toLowerCase();

      if (match.isActive === false) {
        result.restored++;
      } else if (recolour) {
        result.updated++;
      } else {
        result.unchanged++;
        return;
      }

      operations.push({
        updateOne: {
          filter: { _id: match._id, userId },
          update: {
            $set: { isActive: true, ...(recolour && { color: row.color }) },
          },
        },
      });
    });

    if (result.created > 0) {
      const total = await this.categoryEntity.countDocuments({ userId });
      if (total + result.created > MAX_CATEGORIES_PER_USER) {
        throw new CategoryLimitError(
          `This import would create ${result.created} categories, taking you past the limit of ${MAX_CATEGORIES_PER_USER.toLocaleString('en-US')} (you have ${total.toLocaleString('en-US')}, including deleted ones). Nothing was imported.`,
        );
      }
    }

    if (operations.length) {
      await this.categoryEntity.bulkWrite(operations, { ordered: true });
    }

    return result;
  }

  /** All of a user's active categories, for export (by type, then name). */
  async findAllForExport(userId: mongoose.Types.ObjectId) {
    await initDB();

    return this.categoryEntity
      .find({ userId, isActive: true })
      .select('name type color')
      .sort({ type: 1, name: 1 })
      .limit(CATEGORY_EXPORT_MAX_ROWS)
      .lean();
  }

  async getCategoryStats(userId: string) {
    await initDB();

    const stats = await mongoose.model('Category').aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
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

  async setPreferences(
    userId: mongoose.Types.ObjectId,
    payload: {
      name: string;
      type: CategoryTypeEnum;
    }[],
  ) {
    // verify if user exist with the given id
    await userService.findById(userId);
    // 1. Start a Session for Atomicity
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 2. Prepare categories with the owner ID
      const categoriesToCreate = payload.map(cat => ({
        ...cat,
        userId, // Ensure your Category schema has a 'user' or 'owner' field
      }));

      // 3. Bulk Insert Categories
      await this.categoryEntity.insertMany(categoriesToCreate, { session });

      // 4. Update User status
      const updatedUser = await userService.update(userId);

      // 5. Commit the changes
      await session.commitTransaction();

      return {
        success: true,
        user: updatedUser,
      };
    } catch (error) {
      // Rollback if anything goes wrong
      await session.abortTransaction();
      console.error('Preference Service Error:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }
}
