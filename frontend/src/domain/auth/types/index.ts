export interface LoginCredentials {
  admin_username: string;
  admin_password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    username: string;
  };
}
