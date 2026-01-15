import { getArtists } from '@/lib/api/artists';
import MainPage from '@/components/shared/MainPage/MainPage';
import { headers } from 'next/headers';

export default async function ArtistsPage() {
  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const headersList = await headers();

  const isStaticVersion = headersList.get('x-is-static') === 'true';

  const isAuth = isStaticVersion ? false : !!cookieStore.get('accessToken')?.value;

  const artists = await getArtists();

  return <MainPage artists={artists} isAuth={isAuth} />;
}
