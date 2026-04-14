/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import 'reflect-metadata';
import { revalidatePath } from 'next/cache';
import { CategoryService } from '@/backend/modules/category/category.service';
import { CreateCategoryDto } from '@/backend/modules/category/dto/create-category.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import mongoose from 'mongoose';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import { getServerSideSession } from '../next-auth.util';

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

export async function createCategoryAction(
  payload: CategoryPayload,
): Promise<ActionResult> {
  try {
    const user = await getServerSideSession(); // replace with your actual auth
    const userId = new mongoose.Types.ObjectId(user?.user.id);
    const dto = await validateDto(CreateCategoryDto, payload);
    await categoryService.create(dto, userId);
    revalidatePath('/'); // adjust path as needed
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function updateCategoryAction(
  id: string,
  payload: CategoryPayload,
): Promise<ActionResult> {
  try {
    const user = await getServerSideSession();
    const userId = new mongoose.Types.ObjectId(user?.user.id);
    const categoryId = new mongoose.Types.ObjectId(id);

    const dto = await validateDto(CreateCategoryDto, payload);
    await categoryService.update(categoryId, dto, userId); // adjust to your service method
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const categoryId = new mongoose.Types.ObjectId(id);

  try {
    await categoryService.delete(categoryId);
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}

export async function getCategoryByIdAction(id: string) {
  try {
    const categoryId = new mongoose.Types.ObjectId(id);
    const category = await categoryService.findById(categoryId);

    if (!category) return { success: false, error: 'Category not found' };

    // Serialize: converts ObjectId, Date, etc. to plain strings
    const serialized = JSON.parse(JSON.stringify(category));

    return { success: true, data: serialized as ICategory };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllCategoriesAction(payload: {
  name?: string;
  limit?: number;
}) {
  const { name, limit } = payload;
  try {
    const user = await getServerSideSession();
    const categories = await categoryService.findAll({
      search: name,
      limit,
      page: 1,
      type: undefined,
      userId: user?.user.id?.toString() || '',
    });
    return { success: true, data: categories };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function setPreferencesAction(payload: CategoryPayload[]) {
  try {
    const user = await getServerSideSession();
    const userId = new mongoose.Types.ObjectId(user?.user.id);

    // Create transaction using the service
    await categoryService.setPreferences(userId, payload);

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Something went wrong' };
  }
}
