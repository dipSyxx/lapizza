import { Ingredient } from "@prisma/client";
import { ApiRoutes } from "./constants";
import { axiosInstance } from "./instance";

type IngredientCreate = {
  name: string;
  price: number;
  imageUrl: string;
}

type IngredientUpdate = IngredientCreate

export const getAllAdminIngredients = async (): Promise<Ingredient[]> => {
  return (await axiosInstance.get<Ingredient[]>(ApiRoutes.ADMIN_INGREDIENTS)).data;
};

export const getAdminIngredientById = async (id: string): Promise<Ingredient> => {
  return (await axiosInstance.get<Ingredient>(`${ApiRoutes.ADMIN_INGREDIENTS}/${id}`)).data;
};

export const createAdminIngredient = async (ingredient: IngredientCreate): Promise<Ingredient> => {
  return (await axiosInstance.post<Ingredient>(ApiRoutes.ADMIN_INGREDIENTS, ingredient)).data;
};

export const updateAdminIngredient = async (id: string, ingredient: IngredientUpdate): Promise<Ingredient> => {
  return (await axiosInstance.put<Ingredient>(`${ApiRoutes.ADMIN_INGREDIENTS}/${id}`, ingredient)).data;
};

export const deleteAdminIngredient = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ApiRoutes.ADMIN_INGREDIENTS}/${id}`);
};


