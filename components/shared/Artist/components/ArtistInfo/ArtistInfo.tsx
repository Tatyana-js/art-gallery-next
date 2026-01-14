import clsx from 'clsx';
import { FC, useState } from 'react';
import styles from './Artistinfo.module.scss';
import type { IGenre } from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import Label from '@/components/ui_kit/Label';
import SelectButton from '@/components/icons/SelectButton';

export interface IArtistInfoProps {
  description: string;
  genres: IGenre[];
}

const ArtistInfo: FC<IArtistInfoProps> = ({ description, genres }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <p className={clsx(styles.description, !isOpen && styles.gradient)}>
        {description.length < 256
          ? description
          : isOpen
            ? description
            : `${description.substring(0, 256)}...`}
      </p>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.selectButton}>
        <Button variant="text">{isOpen ? 'READ LESS' : 'READ MORE'}</Button>
        <div className={styles.rotated}>
          <SelectButton />
        </div>
      </div>
      <div className={clsx(styles.genresContainer)}>
        {genres.map(({ _id, name }: IGenre) => (
          <Label key={_id}>{name}</Label>
        ))}
      </div>
    </>
  );
};

export default ArtistInfo;
