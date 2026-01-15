import { FC } from 'react';
import styles from './page.module.scss';
import Artist from '@/components/shared/Artist';
import PaintingsGallery from '@/components/shared/PaintingGallery';
import { getArtistById } from '@/lib/api/artists';
import { headers } from 'next/headers';

interface PageProps {
  params: Promise<{ id: string }>;
}

const ArtistProfile: FC<PageProps> = async ({ params }) => {
  const { id } = await params;
  const artist = await getArtistById(id);

  const { cookies } = await import('next/headers');
  const cookieStore = await cookies();
  const headersList = await headers();

  const isStaticVersion = headersList.get('x-is-static') === 'true';

  const isAuth = isStaticVersion ? false : !!cookieStore.get('accessToken')?.value;
  if (!artist) return null;

  return (
    <div className={styles.containerArtist}>
      <Artist artist={artist} isAuth={isAuth} />
      <PaintingsGallery artist={artist} isAuth={isAuth} />
    </div>
  );
};

export default ArtistProfile;
