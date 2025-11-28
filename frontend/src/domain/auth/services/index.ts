import { publicClient } from '@/core/lib/api';
import type { LoginCredentials, AuthResponse } from '../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await publicClient.post('/auth/login', credentials);
    return data.data;
  },
};
