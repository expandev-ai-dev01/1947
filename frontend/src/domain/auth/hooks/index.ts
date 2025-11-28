import { useMutation } from '@tanstack/react-query';
import { authService } from '../services';
import { useAuthStore } from '@/core/stores/auth';
import { useNavigation } from '@/core/hooks/useNavigation';
import type { LoginCredentials } from '../types';

export const useLogin = () => {
  const { setToken } = useAuthStore();
  const { navigate } = useNavigation();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      setToken(data.token);
      navigate('/admin/dashboard');
    },
  });
};
