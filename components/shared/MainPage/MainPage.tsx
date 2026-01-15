'use client';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import styles from './MainPage.module.scss';
import type IArtist from '@/types/Artist.ts';
import Card from '@/components/ui_kit/Card';
import Grid from '@/components/ui_kit/Grid';
import Button from '@/components/ui_kit/Buttons';
import AuthSection from '../AuthSection';
import { useModalStore } from '@/lib/modalStore/modalStore';
import { useRouter } from 'next/navigation';
import { IGenre } from '@/types/Artist';
import useMediaQuery from '@/hooks/useMediaQuery';
import FilterComponent from '@/components/modals/Filter';

interface IMainPageProps {
  artists: IArtist[];
  sort?: 'a_to_z' | 'z_to_a' | null;
  genres?: IGenre[];
  isAuth: boolean;
}

const MainPage: FC<IMainPageProps> = ({ artists, isAuth }) => {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [visibleCount, setVisibleCount] = useState<number>(6);

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

  const { openModal, filterState, setFilterState } = useModalStore();

  // reset pagination when dataset changes (search/filter results or initial SSR list)
  useEffect(() => {
    setVisibleCount(6);
  }, [artistsState]);

  const sortedArtists = useMemo(() => {
    const sortSelected = filterState.sort.selected;
    if (sortSelected === 'a_to_z') {
      return [...artistsState].sort((a, b) => a.name.localeCompare(b.name));
    }
    if (sortSelected === 'z_to_a') {
      return [...artistsState].sort((a, b) => b.name.localeCompare(a.name));
    }
    return artistsState;
  }, [artistsState, filterState.sort.selected]);

  const visibleArtists = sortedArtists?.slice(0, visibleCount) || [];
  const hasMoreArtists = visibleCount < sortedArtists.length;

  const handleLoadMore = () => {
    const nextCount = Math.min(visibleCount + 6, sortedArtists.length);
    setVisibleCount(nextCount);
  };

  const handleSearchChange = (value: string) => {
    setValue(value);
  };

  useEffect(() => {
    if (!isAuth) return;

    const q = value.trim();
    const selectedGenres = filterState.genres.selectedGenres;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const t = setTimeout(async () => {
      try {
        if (!q && selectedGenres.length === 0) {
          setArtistsState(artists);
          return;
        }

        const params = new URLSearchParams();
        if (q) params.set('name', q);
        selectedGenres.forEach((id) => params.append('genres', id));

        const response = await fetch(`/api/artists?${params.toString()}`, {
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
  }, [value, isAuth, artists, filterState.genres.selectedGenres]);

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
          onOpenFilter={() => {
            if (isMobile) {
              openModal('filter');
            } else {
              setFilterState((prev) => ({ ...prev, isOpen: true }));
            }
          }}
        />
      )}
      {isAuth && <FilterComponent />}
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
      {hasMoreArtists && (
        <div className={styles.loadButton}>
          <Button variant="text" onClick={handleLoadMore}>
            LOAD MORE
          </Button>
        </div>
      )}
    </div>
  );
};

export default MainPage;
