import axios, { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { AuthTokens } from '@/types/types';
import { fingerprint } from '@/lib/utils/fingerprint';
import { cookieStorage } from '../utils/cookiesStorage';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const publicApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к запросам
authApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = cookieStorage.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Интерцептор для обработки 401 ошибки и обновления токена
authApi.interceptors.response.use(
  (response: AxiosResponse<any, any, {}>) => response,
  async (error: { config: any; response: { status: number } }) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = cookieStorage.get('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const deviceId = await fingerprint();
        const { data } = await publicApi.post<AuthTokens>('/auth/refresh', {
          refreshToken,
          deviceId,
        });

        cookieStorage.set('accessToken', data.accessToken);
        cookieStorage.set('refreshToken', data.refreshToken);

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        // При ошибке обновления токена делаем логаут
        cookieStorage.remove('accessToken');
        cookieStorage.remove('refreshToken');

        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
