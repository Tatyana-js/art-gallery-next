import { create } from 'zustand';
import { fingerprint } from '../utils/fingerprint';
import { publicApi } from '../api/interceptor';
import { cookieStorage } from '../utils/cookiesStorage';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  registeration: (email: string, password: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {

    try {
      const deviceId = await fingerprint();
      const responce = await publicApi.post('/auth/login', {
        email,
        password,
        deviceId,
      });

      const { accessToken, refreshToken } = responce.data;

      cookieStorage.set('accessToken', accessToken);
      cookieStorage.set('refreshToken', refreshToken);

      set({ isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
  logout: async () => {
    try {
      const refreshToken = cookieStorage.get('refreshToken');

      if (refreshToken) {
        const deviceId = await fingerprint();
        await publicApi.post('/auth/logout', {
          refreshToken,
          deviceId,
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      cookieStorage.remove('accessToken');
      cookieStorage.remove('refreshToken');

      set({
        isAuthenticated: false,
      });
    }
  },
  registeration: async (email, password) => {

    try {
      const deviceId = await fingerprint();
      const responce = await publicApi.post('/auth/register', {
        email,
        password,
        deviceId,
      });

      const { accessToken, refreshToken } = responce.data;

      cookieStorage.set('accessToken', accessToken);
      cookieStorage.set('refreshToken', refreshToken);

      set({ isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },
}));
