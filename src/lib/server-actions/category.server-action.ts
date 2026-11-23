'use server';

import 'reflect-metadata';
import { revalidatePath, updateTag } from 'next/cache';
import { CategoryService } from '@/backend/modules/category/category.service';
import { categoryStatsTag } from '@/backend/modules/category/category-stats.cache';
import { transactionStatsTag } from '@/backend/modules/transaction/transaction-stats.cache';
import { CreateCategoryDto } from '@/backend/modules/category/dto/create-category.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import { requireUser, toObjectId } from './action-guard';

const categoryService = new CategoryService();

interface CategoryPayload {
  name: string;
  type: CategoryTypeEnum;
  icon: string;
  color: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

const errorMessage = (error: unknown) =>
  (error as Error)?.message || 'Something went wrong';

export async function createCategoryAction(
  payload: CategoryPayload,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const dto = await validateDto(CreateCategoryDto, payload);
    await categoryService.create(dto, user.objectId);
    updateTag(categoryStatsTag(user.id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function updateCategoryAction(
  id: string,
  payload: CategoryPayload,
): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const categoryId = toObjectId(id, 'category id');
    const dto = await validateDto(CreateCategoryDto, payload);
    // Service only matches categories owned by this user
    await categoryService.update(categoryId, dto, user.objectId);
    updateTag(categoryStatsTag(user.id));
    // Monthly totals are grouped by category type, which an update can change
    updateTag(transactionStatsTag(user.id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireUser();
    const categoryId = toObjectId(id, 'category id');
    await categoryService.delete(categoryId, user.objectId);
    updateTag(categoryStatsTag(user.id));
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function getCategoryByIdAction(id: string) {
  try {
    const user = await requireUser();
    const categoryId = toObjectId(id, 'category id');
    const category = await categoryService.findById(categoryId, user.objectId);

    if (!category) return { success: false, error: 'Category not found' };

    // Serialize: converts ObjectId, Date, etc. to plain strings
    const serialized = JSON.parse(JSON.stringify(category));

    return { success: true, data: serialized as ICategory };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function getAllCategoriesAction(payload: {
  name?: string;
  limit?: number;
}) {
  try {
    const user = await requireUser();
    const name =
      typeof payload?.name === 'string' ? payload.name.slice(0, 100) : '';
    // Clamp so a caller can't request the whole collection
    const limit = Math.min(Math.max(Number(payload?.limit) || 10, 1), 50);

    const categories = await categoryService.findAll({
      search: name || undefined,
      limit,
      page: 1,
      type: undefined,
      userId: user.id,
    });
    return { success: true, data: categories };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}

export async function setPreferencesAction(payload: CategoryPayload[]) {
  try {
    const user = await requireUser();
    if (!Array.isArray(payload) || payload.length > 100) {
      throw new Error('Invalid preferences.');
    }

    const validated = await Promise.all(
      payload.map(item => validateDto(CreateCategoryDto, item)),
    );

    await categoryService.setPreferences(user.objectId, validated);

    updateTag(categoryStatsTag(user.id));

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    return { success: false, error: errorMessage(error) };
  }
}
