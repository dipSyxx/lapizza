import { Category } from '@prisma/client';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';

// Extend the Category type to include _count
export interface CategoryWithCount extends Category {
  _count: {
    products: number
  }
}

// Type for the data returned by the API
export type CategoryResponse = CategoryWithCount

export const getAdminCategoryById = async (id: string): Promise<CategoryResponse> => {
  return (await axiosInstance.get<CategoryResponse>(`${ApiRoutes.ADMIN_CATEGORIES}/${id}`)).data;
};

export const getAllAdminCategories = async (): Promise<CategoryResponse[]> => {
  return (await axiosInstance.get<CategoryResponse[]>(ApiRoutes.ADMIN_CATEGORIES)).data;
};

export const createAdminCategory = async (name: string): Promise<Category> => {
  return (await axiosInstance.post<Category>(ApiRoutes.ADMIN_CATEGORIES, { name })).data;
};

export const updateAdminCategory = async (id: string, name: string): Promise<Category> => {
  return (await axiosInstance.put<Category>(`${ApiRoutes.ADMIN_CATEGORIES}/${id}`, { name })).data;
};

export const deleteAdminCategory = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ApiRoutes.ADMIN_CATEGORIES}/${id}`);
};




