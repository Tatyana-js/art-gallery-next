import { setupClientApi } from '@/lib/api/interceptor';

export const useApi = () => {
  if (typeof window === 'undefined') {
    throw new Error('useApi can only be used in client components');
  }

  const api = setupClientApi();
  const isAuth = !!document.cookie.split('; ').find((row) => row.startsWith('accessToken='));

  return { api, isAuth };
};
