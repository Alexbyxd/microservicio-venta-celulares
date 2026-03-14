export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  pictureUrl?: string;
  googleId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: Omit<User, 'password'>;
  token: string;
}

export interface ApiError {
  message: string;
  statusCode?: number;
}

export interface AxiosApiError {
  response?: {
    data?: {
      message?: string;
      statusCode?: number;
    };
  };
  message?: string;
}
