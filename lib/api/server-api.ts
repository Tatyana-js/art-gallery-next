// lib/server-api.ts
import { cookies } from 'next/headers';

export async function serverFetch(endpoint: string, options?: RequestInit) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options?.headers
  };
  
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store'
  });
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  
  return response.json();
}