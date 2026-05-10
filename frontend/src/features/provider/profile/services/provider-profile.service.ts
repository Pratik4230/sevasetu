import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";

export interface ProviderProfile {
  _id: string;
  bio: string;
  city: string;
  area: string;
  experienceYears: number;
  isAvailable: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  serviceCategories: Array<{ _id: string; name: string }>;
}

export const providerProfileService = {
  getMyProfile: async () => {
    const res = await apiClient.get<ApiResponse<ProviderProfile>>("/providers/profile/me");
    return res.data.data;
  },
  createProfile: async (payload: {
    bio: string;
    city: string;
    area: string;
    experienceYears?: number;
    serviceCategories: string[];
  }) => {
    const res = await apiClient.post<ApiResponse<ProviderProfile>>("/providers/profile", payload);
    return res.data.data;
  },
  updateProfile: async (payload: {
    bio?: string;
    city?: string;
    area?: string;
    experienceYears?: number;
    serviceCategories?: string[];
  }) => {
    const res = await apiClient.patch<ApiResponse<ProviderProfile>>("/providers/profile", payload);
    return res.data.data;
  },
  toggleAvailability: async () => {
    const res = await apiClient.patch<ApiResponse<{ isAvailable: boolean }>>("/providers/availability");
    return res.data.data;
  },
};
