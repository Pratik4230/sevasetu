import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";
import type { User } from "@/shared/types/user.types";

interface UsersResponse {
  users: User[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

export const adminUserService = {
  getAll: async () => {
    const res = await apiClient.get<ApiResponse<UsersResponse>>("/admin/users");
    return res.data.data;
  },
  deactivate: async (userId: string) => {
    const res = await apiClient.patch<ApiResponse<User>>(`/admin/users/${userId}/deactivate`);
    return res.data.data;
  },
};
