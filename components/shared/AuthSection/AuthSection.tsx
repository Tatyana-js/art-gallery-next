import React from 'react';
import styles from './AuthSection.module.scss';
import Button from '@/components/ui_kit/Buttons';
import Search from '@/components/ui_kit/Search';

import FilterIcon from '@/components/icons/FilterIcon';
import PlusIcon from '@/components/icons/PlusIcon';

interface AuthSectionProps {
  value: string;
  onChange: (value: string) => void;
  onAddArtist: () => void;
  onOpenFilter: () => void;
}

export const AuthSection: React.FC<AuthSectionProps> = ({
  value,
  onChange,
  onAddArtist,
  onOpenFilter,
}) => (
  <div className={styles.buttonContainer}>
    <div className={styles.addArtistButton}>
      <Button variant="text" onClick={onAddArtist}>
        <PlusIcon />
        ADD ARTISTS
      </Button>
    </div>
    <div className={styles.buttons}>
      <div className={styles.searchButton}>
        <Search value={value} onChange={onChange} />
      </div>
      <div className={styles.filterButton}>
        <Button variant="icon" onClick={onOpenFilter}>
          <FilterIcon />
        </Button>
      </div>
    </div>
  </div>
);

export default AuthSection;
