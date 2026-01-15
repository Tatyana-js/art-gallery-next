import type IArtist from '@/types/Artist';
import type { IPainting } from '@/types/Artist';

export const getArtistPaintings = async (artistId: string): Promise<IPainting[]> => {
  const response = await fetch(`/api/artists/${artistId}/paintings`, {
    method: 'GET',
    cache: 'no-store',
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
    throw new Error(message || 'Failed to fetch artist paintings');
  }
  return (Array.isArray(data) ? data : []) as IPainting[];
};

export const getArtistMainPainting = async (artistId: string): Promise<IPainting | null> => {
  const response = await fetch(`/api/artists/${artistId}/main-painting`, {
    method: 'GET',
    cache: 'no-store',
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
    throw new Error(message || 'Failed to fetch artist main painting');
  }
  return (data as IPainting) ?? null;
};

export const updateArtistMainPainting = async (
  artistId: string,
  paintingId: string
): Promise<IArtist> => {
  const response = await fetch(`/api/artists/${artistId}/main-painting`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mainPainting: paintingId }),
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
    throw new Error(message || 'Failed to update artist main painting');
  }
  return data as IArtist;
};

export const addArtistPainting = async (artistId: string, formData: FormData) => {
  const response = await fetch(`/api/artists/${artistId}/paintings`, {
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
    throw new Error(message || 'Failed to add painting');
  }
  return data;
};

export const updateArtistPainting = async (
  artistId: string,
  paintingId: string,
  formData: FormData
) => {
  const response = await fetch(`/api/artists/${artistId}/paintings/${paintingId}`, {
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
    throw new Error(message || 'Failed to update painting');
  }
  return data;
};

export const deleteArtistPainting = async (artistId: string, paintingId: string) => {
  const response = await fetch(`/api/artists/${artistId}/paintings/${paintingId}`, {
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
    throw new Error(message || 'Failed to delete painting');
  }
  return data;
};
