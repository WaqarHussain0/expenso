import { initDB } from '@/backend/utils/dbInit.util';
import CategoryEntity, { CategoryTypeEnum } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import mongoose from 'mongoose';

export class CategoryService {
  private readonly categoryEntity = CategoryEntity;

  async findById(id: string | mongoose.Types.ObjectId) {
    await initDB();

    const data = await this.categoryEntity
      .findById(id)
      .lean({ virtuals: true });

    if (!data) {
      throw new Error(`Category with id ${id} not found`);
    }

    return data;
  }

  async findByName(name: string) {
    await initDB();

    return await this.categoryEntity.findOne({
      name: name?.trim()?.toLowerCase(),
    });
  }

  async create(payload: CreateCategoryDto) {
    const { name } = payload;

    await initDB();

    const existingData = await this.findByName(name);

    if (existingData) {
      throw new Error(
        `Category with name ${name} already exists, please use a different name.`,
      );
    }

    return await this.categoryEntity.create(payload);
  }

  async findAll({
    search,
    page = 1,
    limit = 10,
    type,
    isServerSide = false,
  }: {
    search?: string;
    page?: number;
    limit?: number;
    type: CategoryTypeEnum | undefined;
    isServerSide: boolean;
  }) {
    await initDB(isServerSide);

    const query: Record<string, any> = {};
    // ✅ add type filter
    if (type) {
      query.type = type;
    }

    if (search) {
      query['$or'] = [{ name: { $regex: search, $options: 'i' } }];
    }

    const skip = (page - 1) * limit;
    const totalRecords = await this.categoryEntity.countDocuments(query);

    const categories = await this.categoryEntity
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();

    const data = categories?.map(item => {
      return {
        name: item.name,
        type: item.type,
        _id: item._id?.toString(),
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
      };
    });

    const totalPages = Math.ceil(totalRecords / limit);

    return { data, meta: { page, totalRecords, totalPages } };
  }

  async delete(id: mongoose.Types.ObjectId) {
    await initDB();
    const deletedData = await this.categoryEntity.findByIdAndDelete(id);

    if (!deletedData) {
      throw new Error(`Category with id ${id} not found`);
    }

    return deletedData;
  }

  async update(id: mongoose.Types.ObjectId, payload: CreateCategoryDto) {
    const [data, existingName] = await Promise.all([
      this.findById(id),
      this.findByName(payload.name),
    ]);

    if (!data) {
      throw new Error(`Category with id ${id} not found`);
    }

    if (existingName && existingName._id !== id) {
      throw new Error(
        `Category with name ${payload.name} already exists, please use a different name.`,
      );
    }

    return await this.categoryEntity.findByIdAndUpdate(
      id,
      payload,
      { new: true }, // return updated document
    );
  }
}
