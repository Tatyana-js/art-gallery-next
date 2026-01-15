import { cache } from 'react';
import type IArtist from '@/types/Artist';

async function getInternalApiRequest(path: string): Promise<{
  url: string;
  init?: RequestInit;
}> {
  if (typeof window !== 'undefined') return { url: path };

  const { headers } = await import('next/headers');
  const h = await headers();
  const proto = h.get('x-forwarded-proto') ?? 'http';
  const host = h.get('x-forwarded-host') ?? h.get('host');
  if (!host) throw new Error('Cannot determine request host for internal API fetch');

  const cookie = h.get('cookie') ?? '';
  return {
    url: `${proto}://${host}${path}`,
    init: cookie ? { headers: { cookie } } : undefined,
  };
}

// === ARTISTS LIST (main page) ===
export const getArtists = cache(
  async (params?: { name?: string; genres?: string[]; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.name) searchParams.append('name', params.name);
    if (params?.sort) searchParams.append('sort', params.sort);
    if (params?.genres && params.genres.length > 0) {
      params.genres.forEach((genre) => searchParams.append('genres', genre));
    }
    const qs = searchParams.toString();
    const { url, init } = await getInternalApiRequest(qs ? `/api/artists?${qs}` : '/api/artists');

    try {
      const response = await fetch(url, { ...init, cache: 'no-store' });
      const data = (await response.json().catch(() => null)) as unknown;
      if (!response.ok) return [];
      if (Array.isArray(data)) return data as IArtist[];
      if (data && typeof data === 'object') {
        const obj = data as { data?: unknown; artists?: unknown };
        if (Array.isArray(obj.data)) return obj.data as IArtist[];
      }
      return [];
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
);

// === ARTIST PAGE (get main artist page data) ===
export const getArtistById = cache(async (id: string | undefined): Promise<IArtist | null> => {
  try {
    if (!id) return null;
    const { url, init } = await getInternalApiRequest(`/api/artists/${id}`);
    const response = await fetch(url, { ...init, cache: 'no-store' });
    if (!response.ok) return null;
    const data = (await response.json().catch(() => null)) as unknown;
    return data as IArtist;
  } catch (error) {
    console.error('Error fetching artist by id:', error);
    return null;
  }
});

// === ARTIST MUTATIONS (edit main artist page) ===
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
  const response = await fetch(`/api/artists/${id}`, {
    method: 'PUT',
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
    throw new Error(message || 'Failed to update artist');
  }
  return data;
};

export const deleteArtist = async (id: string) => {
  const response = await fetch(`/api/artists/${id}`, {
    method: 'DELETE',
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
    throw new Error(message || 'Failed to delete artist');
  }
  return data;
};
