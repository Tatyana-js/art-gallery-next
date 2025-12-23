import { setupClientApi } from './interceptor';
import { createServerApi } from './server-api';

export const getApi = async () => {
  if (typeof window === 'undefined') {
    return await createServerApi();
  } else {
    return setupClientApi();
  }
};
