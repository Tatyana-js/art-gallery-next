// import { cookies } from 'next/headers';

// export async function serverFetch(endpoint: string, options?: RequestInit) {
//   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//   const cookieStore = await cookies();
//   const token = cookieStore.get('accessToken')?.value;

//   const headers = {
//     'Content-Type': 'application/json',
//     ...(token && { 'Authorization': `Bearer ${token}` }),
//     ...options?.headers
//   };

//   const response = await fetch(`${apiUrl}${endpoint}`, {
//     ...options,
//     headers,
//   });

//   if (!response.ok) {
//     throw new Error(`HTTP ${response.status}`);
//   }

//   return response.json();
// }

// lib/api.ts

// type FetchOptions = RequestInit & {
//   requireAuth?: boolean;
//   cache?: RequestCache;
// };

// api/server-api.ts
import axios from 'axios';

export const createServerApi = async () => {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (token) {
    instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  return instance;
};
