'use client';
import { FC, useState } from 'react';
import styles from './MainPage.module.scss';
import type IArtist from '@/types/Artist.ts';
import Card from '@/components/ui_kit/Card';
import Grid from '@/components/ui_kit/Grid';
import AuthSection from '../AuthSection';
import { useModalStore } from '@/lib/modalStore/modalStore';
import { useRouter, useSearchParams } from 'next/navigation';
import { IGenre } from '@/types/Artist';

interface IMainPageProps {
  artists: IArtist[];
  // search: string;
  sort?: 'a_to_z' | 'z_to_a' | null;
  genres?: IGenre[];
  isAuth: boolean;
}

const MainPage: FC<IMainPageProps> = ({ artists, genres, sort, isAuth }) => {
  const [value, setValue] = useState('');

  const searchParams = useSearchParams();
  const router = useRouter();
  const visibleCount = 6;

  const { openModal } = useModalStore();
  const visibleArtists = artists?.slice(0, visibleCount) || [];

  const handleSearchChange = (value: string) => {
    setValue(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set('search', value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={styles.mainPage}>
      {isAuth && (
        <AuthSection
          value={value}
          onChange={handleSearchChange}
          onAddArtist={() => openModal('addArtist')}
          onOpenFilter={() => openModal('filter')}
        />
      )}
      <Grid>
        {visibleArtists?.map((artist: IArtist) => (
          <Card
            key={artist._id}
            name={artist.name}
            details={artist.yearsOfLife}
            imageSrc={artist.mainPainting?.image?.src ?? ''}
            type="painting"
          />
        ))}
        {visibleArtists.length === 0 && (
          <div className={styles.messageContainer}>
            <p className={styles.noResults}>
              No matches for <span className={styles.searchValue}>{value}</span>
            </p>
            <p className={styles.message}>
              Please try again with a different spelling or keywords.
            </p>
          </div>
        )}
      </Grid>
    </div>
  );
};

export default MainPage;
