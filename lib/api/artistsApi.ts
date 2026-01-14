import { cache } from 'react';
import type IArtist from '@/types/Artist';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function getToken(): Promise<{ token: string | undefined; isAuth: boolean }> {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  return { token, isAuth: !!token };
}

export const getArtists = cache(
  async (params?: { name?: string; genres?: string[]; sort?: string }) => {
    const { token, isAuth } = await getToken();

    const endpoint = isAuth ? '/artists' : '/artists/static/';
    const searchParams = new URLSearchParams();
    if (params?.name) searchParams.append('name', params.name);
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
  const response = await fetch('/api/artists', {
    method: 'POST',
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const message =
      data &&
      typeof data === 'object' &&
      'message' in data &&
      typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message: string }).message
        : undefined;
    throw new Error(message || 'Failed to create artist');
  }
  return data;
};

export const updateArtist = async (id: string, formData: FormData) => {
  try {
    const response = await fetch(`/api/artists/${id}`, {
      method: 'PUT',
      body: formData,
    });
    if (!response.ok) {
      throw new Error('Failed to update artist');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error updating artist:', error);
    return null;
  }
};

export const deleteArtist = async (id: string) => {
  try {
    const response = await fetch(`/api/artists/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete artist');
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error deleting artist:', error);
    return null;
  }
};
