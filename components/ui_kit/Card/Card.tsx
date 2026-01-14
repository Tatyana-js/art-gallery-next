import clsx from 'clsx';
import { FC } from 'react';
import Image from 'next/image';
import styles from './Card.module.scss';
import getImageSrc from '@/lib/utils/getImageSrc';
import ComeIn from '@/components/icons/ComeIn';
import EmptyImage from '@/components/image/EmptyImage';

export interface ICardProps {
  name?: string;
  imageSrc: string;
  details: string;
  type: 'painting' | 'artist';
  onClick?: () => void;
}

const Card: FC<ICardProps> = ({ name, imageSrc, details, type, onClick }) => {
  const isEmpty = !imageSrc;

  return (
    <div
      onClick={onClick}
      className={clsx(styles.painting, type === 'artist' && styles.paintingArtist)}
    >
      <a href="#" className={styles.linkboxOverlay} title="Link to ArtistPage"></a>
      {isEmpty ? (
        <div className={styles.emptyContainer}>
          <EmptyImage />
          <p className={styles.emptyMessage}>NO IMAGE UPLOADED</p>
        </div>
      ) : (
        <Image
          src={getImageSrc(imageSrc)}
          alt={name || 'Avatar'}
          className={styles.cardImage}
          fill
          priority={true}
          sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
        />
      )}
      <div className={clsx(styles.container, type === 'artist' && styles.containerArtist)}>
        <div className={styles.line}>
          <ComeIn />
        </div>
        <p className={styles.name}>{name}</p>
        <p className={styles.details}>{details}</p>
      </div>
    </div>
  );
};

export default Card;
