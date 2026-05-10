import { apiClient } from "../../../shared/api/axios.client";
import type { ApiResponse } from "../../../shared/types/api.types";
import type { User } from '../../../shared/types/user.types';
import type { LoginInput, RegisterInput } from "../schemas/auth.schema";

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (data: LoginInput): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data;
  },

  register: async (data: RegisterInput): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data;
  },
  
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  }
};
