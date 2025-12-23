import { cache } from 'react';

export const getArtists = cache(
  async (params?: { search?: string; genres?: string[]; sort?: string }) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;
    const isAuth = !!token;

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

    const url = `${apiUrl}${baseEndpoint}`;

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
          const staticUrl = `${apiUrl}/artists/static/`;
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
