import { User, UserRole } from '@prisma/client';
import { axiosInstance } from './instance';
import { ApiRoutes } from './constants';

// Extended User interface with order count
export interface UserWithCount extends Omit<User, 'password'> {
  _count: {
    Orders: number
  },
  _isLastAdmin?: boolean
}

// Type for the data returned by the API
export type UserResponse = UserWithCount;

export const getAdminUserById = async (id: string): Promise<UserResponse> => {
  return (await axiosInstance.get<UserResponse>(`${ApiRoutes.ADMIN_USERS}/${id}`)).data;
};

export const getAllAdminUsers = async (): Promise<UserResponse[]> => {
  return (await axiosInstance.get<UserResponse[]>(ApiRoutes.ADMIN_USERS)).data;
};

export const updateAdminUser = async (
  id: string,
  userData: { fullName: string; email: string; role: UserRole }
): Promise<UserResponse> => {
  return (await axiosInstance.put<UserResponse>(ApiRoutes.ADMIN_USERS, {
    id,
    ...userData
  })).data;
};

export const deleteAdminUser = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${ApiRoutes.ADMIN_USERS}/${id}`);
};
