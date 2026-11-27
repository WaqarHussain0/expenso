'use server';

import 'reflect-metadata';
import { revalidatePath, updateTag } from 'next/cache';
import {
  CategoryService,
  ICategoryImportResult,
} from '@/backend/modules/category/category.service';
import { buildCategoriesCsv, parseCategoryCsv } from '@/lib/category-csv.util';
import { categoryStatsTag } from '@/backend/modules/category/category-stats.cache';
import { transactionStatsTag } from '@/backend/modules/transaction/transaction-stats.cache';
import { CreateCategoryDto } from '@/backend/modules/category/dto/create-category.dto';
import { validateDto } from '@/backend/utils/input-validator.util';
import { CategoryTypeEnum, ICategory } from '@/types/category.type';
import {
  enforceRateLimit,
  RateLimitError,
  withLock,
} from '@/backend/modules/rate-limit/rate-limit.service';
import { LIMITS } from '@/backend/modules/rate-limit/limits.constant';
import { ActionAuthError, requireUser, toObjectId } from './action-guard';

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

/** Messages we wrote ourselves are safe to show; anything else (e.g. a
 * database error) is logged and replaced with a generic message. */
class CategoryCsvError extends Error {}

const safeErrorMessage = (error: unknown, context: string) => {
  if (
    error instanceof CategoryCsvError ||
    error instanceof RateLimitError ||
    error instanceof ActionAuthError
  ) {
    return error.message;
  }
  console.error(`${context} failed:`, error);
  return 'Something went wrong. Please try again.';
};

interface IImportCategoriesResult extends ActionResult {
  /** Validation problems, one per line (when the file is rejected) */
  errors?: string[];
  summary?: ICategoryImportResult;
}

/**
 * Import categories from the CSV template. The file is validated again here
 * with the same rules the browser used — never trust the client. New
 * categories are created, existing ones (same name + type) updated.
 */
export async function importCategoriesAction(
  csvText: string,
): Promise<IImportCategoriesResult> {
  try {
    const user = await requireUser();

    if (typeof csvText !== 'string') {
      throw new CategoryCsvError('Choose a CSV file to import.');
    }

    const { rows, errors } = parseCategoryCsv(csvText);

    if (errors.length) {
      return { success: false, error: 'The file has problems.', errors };
    }

    await enforceRateLimit({
      action: 'category-import',
      subject: user.id,
      ...LIMITS.categoryImport,
      message: `You can import up to ${LIMITS.categoryImport.limit} files every 10 minutes.`,
    });

    // One import per user at a time — two racing imports could both decide
    // a category is new and create it twice
    const summary = await withLock(
      `category-import:${user.id}`,
      60,
      'Another import is still running. Wait for it to finish.',
      () => categoryService.importMany(user.objectId, rows),
    ).catch(error => {
      if (error?.name === 'CategoryLimitError') {
        throw new CategoryCsvError(error.message);
      }
      throw error;
    });

    if (summary.created || summary.restored) {
      updateTag(categoryStatsTag(user.id));
    }
    revalidatePath('/');

    return { success: true, summary };
  } catch (error) {
    return {
      success: false,
      error: safeErrorMessage(error, 'Category import'),
    };
  }
}

interface IExportCategoriesResult extends ActionResult {
  csv?: string;
  fileName?: string;
}

/** All of the signed-in user's categories as CSV (same columns as import). */
export async function exportCategoriesAction(): Promise<IExportCategoriesResult> {
  try {
    const user = await requireUser();

    await enforceRateLimit({
      action: 'category-export',
      subject: user.id,
      ...LIMITS.categoryExport,
      message: `You can export up to ${LIMITS.categoryExport.limit} times every 10 minutes.`,
    });

    const categories = await categoryService.findAllForExport(user.objectId);

    if (categories.length === 0) {
      return { success: false, error: 'You have no categories to export yet.' };
    }

    const today = new Date().toISOString().slice(0, 10);

    return {
      success: true,
      csv: buildCategoriesCsv(categories),
      fileName: `expenso-categories-${today}.csv`,
    };
  } catch (error) {
    return {
      success: false,
      error: safeErrorMessage(error, 'Category export'),
    };
  }
}
