import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";

export interface AdminCategory {
  _id: string;
  name: string;
  description: string;
  iconUrl?: string;
  basePrice?: number;
  isActive: boolean;
}

export interface UpsertCategoryPayload {
  name: string;
  description: string;
  iconUrl?: string;
  basePrice?: number;
}

export const adminCategoryService = {
  getCategories: async () => {
    const res = await apiClient.get<ApiResponse<AdminCategory[]>>("/services/categories");
    return res.data.data;
  },
  createCategory: async (payload: UpsertCategoryPayload) => {
    const res = await apiClient.post<ApiResponse<AdminCategory>>("/admin/categories", payload);
    return res.data.data;
  },
  updateCategory: async (id: string, payload: Partial<UpsertCategoryPayload>) => {
    const res = await apiClient.patch<ApiResponse<AdminCategory>>(`/admin/categories/${id}`, payload);
    return res.data.data;
  },
  deleteCategory: async (id: string) => {
    await apiClient.delete(`/admin/categories/${id}`);
  },
};
