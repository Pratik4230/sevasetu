import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";
import type { User } from "@/shared/types/user.types";

export const profileService = {
  getMe: async () => {
    const res = await apiClient.get<ApiResponse<User>>("/users/me");
    return res.data.data;
  },
  updateMe: async (payload: { name?: string; phone?: string; avatar?: File }) => {
    const form = new FormData();
    if (payload.name) form.append("name", payload.name);
    if (payload.phone) form.append("phone", payload.phone);
    if (payload.avatar) form.append("avatar", payload.avatar);
    const res = await apiClient.patch<ApiResponse<User>>("/users/me", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
