import { apiClient } from "@/shared/api/axios.client";
import type { ApiResponse } from "@/shared/types/api.types";

export interface ServiceCategory {
  _id: string;
  name: string;
  description?: string;
  basePrice?: number;
}

export interface ProviderSummary {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  city: string;
  area: string;
  bio: string;
  avgRating: number;
  totalReviews: number;
  serviceCategories: Array<{
    _id: string;
    name: string;
  }>;
}

interface BrowseProvidersResponse {
  providers: ProviderSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const providerDiscoveryService = {
  getCategories: async () => {
    const res = await apiClient.get<ApiResponse<ServiceCategory[]>>(
      "/services/categories"
    );
    return res.data.data;
  },

  browse: async (params?: { city?: string; area?: string; categoryId?: string }) => {
    const res = await apiClient.get<ApiResponse<BrowseProvidersResponse>>("/providers", {
      params,
    });
    return res.data.data;
  },
};
