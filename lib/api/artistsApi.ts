// app/actions/getArtists.ts
import { cache } from 'react';

export const getArtists = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // Получаем токен на сервере
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;
  const isAuth = !!token;
  
  const endpoint = isAuth ? '/artists' : '/artists/static/';
  const url = `${apiUrl}${endpoint}?limit=50`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      cache: 'no-store'
    });
    
    if (!response.ok) {
      // Если авторизованный запрос не сработал, пробуем статический
      if (isAuth) {
        const staticUrl = `${apiUrl}/artists/static/?limit=50`;
        const staticResponse = await fetch(staticUrl, {
          headers: { 'Content-Type': 'application/json' },
          cache: 'no-store'
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
});