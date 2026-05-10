import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";

export interface PendingProvider {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  city: string;
  area: string;
  bio: string;
  documents: string[];
  serviceCategories: Array<{ _id: string; name: string }>;
  approvalStatus: "pending" | "approved" | "rejected";
}

interface PendingProvidersResponse {
  providers: PendingProvider[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const adminProviderService = {
  getPending: async () => {
    const res = await apiClient.get<ApiResponse<PendingProvidersResponse>>(
      "/admin/providers/pending"
    );
    return res.data.data;
  },
  approve: async (providerProfileId: string) => {
    const res = await apiClient.patch<ApiResponse<PendingProvider>>(
      `/admin/providers/${providerProfileId}/approve`
    );
    return res.data.data;
  },
  reject: async (providerProfileId: string, reason?: string) => {
    const res = await apiClient.patch<ApiResponse<PendingProvider>>(
      `/admin/providers/${providerProfileId}/reject`,
      { reason }
    );
    return res.data.data;
  },
};
