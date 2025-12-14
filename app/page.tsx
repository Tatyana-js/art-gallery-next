import { getArtists } from '@/lib/api/artistsApi';
import MainPage from '@/components/shared/MainPage';

interface PageProps {
  searchParams: {
    search?: string;
    genres?: string;
    sort?: 'a_to_z' | 'z_to_a' | null;
    visible?: string;
  };
}

// app/page.tsx
export default async function HomePage({ searchParams }: PageProps) {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const isAuth = !!cookieStore.get('accessToken')?.value;
  
  const artists = await getArtists();
  
  return <MainPage artists={artists} isAuth={isAuth} />;
}