'use client';
import { FC, useEffect, useRef, useState } from 'react';
import styles from './MainPage.module.scss';
import type IArtist from '@/types/Artist.ts';
import Card from '@/components/ui_kit/Card';
import Grid from '@/components/ui_kit/Grid';
import AuthSection from '../AuthSection';
import { useModalStore } from '@/lib/modalStore/modalStore';
import { useRouter } from 'next/navigation';
import { IGenre } from '@/types/Artist';

interface IMainPageProps {
  artists: IArtist[];
  sort?: 'a_to_z' | 'z_to_a' | null;
  genres?: IGenre[];
  isAuth: boolean;
}

const MainPage: FC<IMainPageProps> = ({ artists, isAuth }) => {
  const router = useRouter();
  const visibleCount = 6;

  const [value, setValue] = useState('');
  const [artistsState, setArtistsState] = useState<IArtist[]>(artists);
  const abortRef = useRef<AbortController | null>(null);

  const getMessage = (data: unknown): string | undefined => {
    if (!data || typeof data !== 'object') return undefined;
    if (!('message' in data)) return undefined;
    const msg = (data as { message?: unknown }).message;
    return typeof msg === 'string' ? msg : undefined;
  };

  const extractArtistsList = (data: unknown): IArtist[] => {
    if (Array.isArray(data)) return data as IArtist[];
    if (data && typeof data === 'object') {
      const obj = data as { data?: unknown; artists?: unknown };
      if (Array.isArray(obj.data)) return obj.data as IArtist[];
    }
    return [];
  };

  useEffect(() => {
    setArtistsState(artists);
  }, [artists]);

  const { openModal } = useModalStore();
  const visibleArtists = artistsState?.slice(0, visibleCount) || [];

  const handleSearchChange = (value: string) => {
    setValue(value);
  };

  useEffect(() => {
    if (!isAuth) return;

    const q = value.trim();
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const t = setTimeout(async () => {
      try {
        if (!q) {
          setArtistsState(artists);
          return;
        }

        const response = await fetch(`/api/artists?name=${encodeURIComponent(q)}`, {
          method: 'GET',
          signal: controller.signal,
        });

        const data = (await response.json().catch(() => null)) as unknown;
        if (!response.ok) {
          console.error('Search failed', getMessage(data) || '');
          return;
        }

        setArtistsState(extractArtistsList(data));
      } catch (e) {
        if (e instanceof DOMException && e.name === 'AbortError') return;
        console.error('Search error', e);
      }
    }, 250);

    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [value, isAuth, artists]);

  const handleCardClick = (artistId: string) => {
    const path = isAuth ? `/artists/${artistId}` : `/artists/static/${artistId}`;
    router.push(path);
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
            onClick={() => handleCardClick(artist._id)}
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
