import axios from 'axios';
import { getFingerprint } from '../utils/fingerprint';

// ТОЛЬКО для клиентских компонентов (с интерцепторами)
export const setupClientApi = () => {
  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  // Интерцептор запросов
  instance.interceptors.request.use(async (config) => {
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.url?.includes('/auth/')) {
      const fingerprint = await getFingerprint();
      config.headers['X-Fingerprint'] = fingerprint;
    }

    return config;
  });

  // Интерцептор ответов (refresh токен)
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;

        try {
          const refreshToken = document.cookie
            .split('; ')
            .find((row) => row.startsWith('refreshToken='))
            ?.split('=')[1];

          if (!refreshToken) {
            throw new Error('No refresh token');
          }

          const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (!refreshResponse.ok) {
            throw new Error('Refresh failed');
          }
          const data = await refreshResponse.json();

          document.cookie = `accessToken=${data.accessToken}; path=/`;
          if (data.refreshToken) {
            document.cookie = `refreshToken=${data.refreshToken}; path=/`;
          }

          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return instance(error.config);
        } catch {
          document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          document.cookie = 'refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

// Хук для использования в клиентских компонентах
export const useApi = () => {
  if (typeof window === 'undefined') {
    throw new Error('useApi can only be used in client components');
  }
  
  const api = setupClientApi();
  const isAuth = !!document.cookie.split('; ').find((row) => row.startsWith('accessToken='));
  
  return { api, isAuth };
};
