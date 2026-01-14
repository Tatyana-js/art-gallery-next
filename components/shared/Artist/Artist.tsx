'use client';

import clsx from 'clsx';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { useModalStore } from '@/lib/modalStore/modalStore';

import styles from './Artist.module.scss';
import ArtistInfo from './components/ArtistInfo';

import IArtist from '@/types/Artist';

import Button from '@/components/ui_kit/Buttons';
import Card from '@/components/ui_kit/Card/Card';

import BackIcon from '@/components/icons/BackIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';

export interface IArtistsProps {
  artist: IArtist;
  isAuth: boolean;
}

const Artist: FC<IArtistsProps> = ({ artist, isAuth }) => {
  const router = useRouter();
  const { openModal } = useModalStore();

  const { name, yearsOfLife, description, genres, avatar } = artist;

  return (
    <div className={clsx('container', styles.container)}>
      <div className={styles.buttonsBack}>
        <Button
          variant="text"
          onClick={() => router.replace(isAuth ? '/artists' : '/artists/static/')}
        >
          <BackIcon />
          <span className={styles.backText}>BACK</span>
        </Button>
      </div>
      {isAuth && (
        <div className={styles.editButtons}>
          <Button variant="icon" onClick={() => openModal('addArtist', { artist })}>
            <EditIcon />
          </Button>
          <Button
            variant="icon"
            onClick={() => openModal('deleteArtist', { artist, type: 'artist' })}
          >
            <DeleteIcon />
          </Button>
        </div>
      )}
      <Card type="artist" name={name} imageSrc={avatar?.src || ''} details={yearsOfLife} />
      <div className={styles.tabletLgOnly}>
        <div className={styles.line}></div>
        <p className={styles.details}>{yearsOfLife}</p>
        <p className={styles.name}>{name}</p>
        <ArtistInfo description={description} genres={genres} />
      </div>
      <div className={clsx('container', styles.notDesctop)}>
        <ArtistInfo description={description} genres={genres} />
      </div>
    </div>
  );
};

export default Artist;
