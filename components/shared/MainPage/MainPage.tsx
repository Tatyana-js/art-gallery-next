import { FC } from 'react';
import styles from './MainPage.module.scss';
import type IArtist from '@/types/Artist.ts';
import Card from '@/components/ui_kit/Card';
import Grid from '@/components/ui_kit/Grid';

interface IMainPageProps {
  artists: IArtist[];
}

const MainPage: FC<IMainPageProps> = ({ artists }) => {
  const visibleCount = 6;

  const visibleArtists = artists.slice(0, visibleCount);

  return (
    <div className={styles.mainPage}>
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
              No matches for <span className={styles.searchValue}>{}</span>
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
