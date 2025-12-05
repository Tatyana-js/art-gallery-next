import { ArtistsQueryParams } from '@/types/types';
import { cache } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Получение всех артистов (статичная версия)
export const getArtists = cache(async (params?: ArtistsQueryParams) => {
  const searchParams = new URLSearchParams();
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((item) => {
            searchParams.append(key, item.toString());
          });
        } else {
          searchParams.append(key, value.toString());
        }
      }
    });
  }
  
  const queryString = searchParams.toString();
  const url = `${API_URL}/artists/static/${queryString ? `?${queryString}` : ''}`;
  
  const response = await fetch(url, {
    // Настраиваем кэширование Next.js
    next: {
      tags: ['artists'], // Для инвалидации
      revalidate: 3600,  // Кэш на 1 час (как keepUnusedDataFor)
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch artists');
  }
  
  return response.json();
});