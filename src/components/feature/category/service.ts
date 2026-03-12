import { CategoryTypeEnum } from '@/types/category.type';

interface ICreateOrUpdatePayload {
  name: string;
  type: CategoryTypeEnum;
}

export const createCategoryService = async (
  payload: ICreateOrUpdatePayload,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return await fetch(`${baseUrl}/api/categories`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const updateCategoryService = async (
  id: string,
  payload: ICreateOrUpdatePayload,
) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return await fetch(`${baseUrl}/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
};

export const deleteCategoryService = async (id: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  return await fetch(`${baseUrl}/api/categories/${id}`, {
    method: 'DELETE',
  });
};
