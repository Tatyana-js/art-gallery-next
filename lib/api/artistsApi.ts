import { cache } from 'react';
import type IArtist from '@/types/Artist';
import { setupClientApi } from './interceptor';
import type { AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken(): Promise<{ token: string | undefined; isAuth: boolean }> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  return { token, isAuth: !!token };
}

export const getArtists = cache(
  async (params?: { search?: string; genres?: string[]; sort?: string }) => {
    const { token, isAuth } = await getToken();

    const endpoint = isAuth ? '/artists' : '/artists/static/';
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.append('search', params.search);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.genres && params.genres.length > 0) {
      params.genres.forEach((genre) => {
        searchParams.append('genres', genre);
      });
    }

    const queryString = searchParams.toString();
    const baseEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;

    const url = `${API_URL}${baseEndpoint}`;

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        cache: 'no-store',
      });

      if (!response.ok) {
        if (isAuth) {
          const staticUrl = `${API_URL}/artists/static/`;
          const staticResponse = await fetch(staticUrl, {
            headers: { 'Content-Type': 'application/json' },
            cache: 'no-store',
          });

          if (staticResponse.ok) {
            const data = await staticResponse.json();
            return Array.isArray(data) ? data : data.data || data.artists || [];
          }
        }
        return [];
      }

      const data = await response.json();
      return Array.isArray(data) ? data : data.data || data.artists || [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
);

export const getArtistById = cache(async (id: string | undefined): Promise<IArtist | null> => {
  const { token, isAuth } = await getToken();

  const endpoint = isAuth ? `/artists/${id}` : `/artists/static/${id}`;
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching artist by id:', error);
    return null;
  }
});

export const createArtist = async (formData: FormData) => {
  const api = setupClientApi();
  try {
    const response = await api.post('/artists', formData);

    return response.data;
  } catch (error) {
    console.error('Error creating artist:', error);
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to create artist');
  }
};

export const updateArtist = async (id: string, formData: FormData) => {
  const api = setupClientApi();
  try {
    const response = await api.put(`/artists/${id}`, formData);

    return response.data;
  } catch (error) {
    console.error('Error updating artist:', error);
    const axiosError = error as AxiosError<{ message?: string }>;
    if (axiosError.response?.data?.message) {
      throw new Error(axiosError.response.data.message);
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Failed to update artist');
  }
};
