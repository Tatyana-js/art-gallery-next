import type IArtist from '@/types/Artist.ts';
import { getArtists } from '@/lib/api/artistsApi';
import MainPage from '@/components/shared/MainPage';

export default async function HomePage() {
  const artists: IArtist[] = await getArtists();

  return <MainPage artists={artists} />;
}


