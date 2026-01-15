'use client';

import clsx from 'clsx';
import { produce } from 'immer';
import { FC, useEffect, useState } from 'react';
import styles from './FilterModal.module.scss';

import type { IGenre } from '@/types/Artist';
import type { IFilterModalState } from '@/types/types';

import Button from '@/components/ui_kit/Buttons';
import MinusIcon from '@/components/icons/MinusIcon';
import PlusIcon from '@/components/icons/PlusIcon';

import { useModalStore } from '@/lib/modalStore/modalStore';
import { getGenres } from '@/lib/api/genres';

type SortType = 'recently_added' | 'a_to_z' | 'z_to_a' | null;

const FilterModal: FC = () => {
  const { filterState, setFilterState, currentModal, closeModal } = useModalStore();
  const { genres, sort } = filterState;

  const [genresData, setGenresData] = useState<IGenre[]>([]);

  useEffect(() => {
    const loadGenres = async () => {
      const data = await getGenres();
      setGenresData(data);
    };
    loadGenres();
  }, []);

  const toggleList = () => {
    setFilterState(
      produce((draft: IFilterModalState) => {
        draft.genres.isListOpen = !draft.genres.isListOpen;
      })
    );
  };

  const toggleSort = () => {
    setFilterState(
      produce((draft: IFilterModalState) => {
        draft.sort.isSortOpen = !draft.sort.isSortOpen;
      })
    );
  };

  const handleSortSelect = (sortType: SortType) => {
    setFilterState(
      produce((draft: IFilterModalState) => {
        draft.sort.selected = draft.sort.selected === sortType ? null : sortType;
      })
    );
  };

  const handleGenreClick = (genre: IGenre) => {
    setFilterState(
      produce((draft: IFilterModalState) => {
        const idx = draft.genres.selectedGenres.findIndex((id: string) => id === genre._id);
        if (idx > -1) draft.genres.selectedGenres.splice(idx, 1);
        else draft.genres.selectedGenres.push(genre._id);
      })
    );
  };

  const handleClear = () => {
    setFilterState(
      produce((draft: IFilterModalState) => {
        draft.genres.selectedGenres = [];
        draft.sort.selected = null;
      })
    );
  };

  const handleApply = () => {
    setFilterState(
      produce((draft: IFilterModalState) => {
        draft.isOpen = false;
      })
    );
    if (currentModal.variant === 'filter') closeModal();
  };

  const isSelected = (id: string) =>
    genres.selectedGenres.some((genreId: string) => genreId === id) ? `${styles.selectedItem}` : '';

  const getSortClasses = (type: SortType) =>
    clsx(styles.genreItem, sort.selected === type && styles.selectedItem);

  const hasActiveFilters = genres.selectedGenres.length > 0 || sort.selected !== null;

  return (
    <div className={clsx(styles.filterContainer, 'container')}>
      <div className={styles.sectionContainer}>
        <div className={styles.filterButtons}>
          <Button variant="icon" onClick={toggleList}>
            <p className={styles.title}>
              GENRES
              {genres.selectedGenres.length > 0 && `(${genres.selectedGenres.length})`}
            </p>
            <div className={styles.iconButton}>
              {!genres.isListOpen ? <PlusIcon /> : <MinusIcon />}
            </div>
          </Button>
        </div>
        {genres.isListOpen && (
          <div className={styles.genres}>
            {genresData?.map((genre) => (
              <button
                key={genre._id}
                type="button"
                className={clsx(styles.genreItem, isSelected(genre._id))}
                onClick={() => handleGenreClick(genre)}
              >
                {genre.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={styles.sectionContainer}>
        <div className={styles.filterButtons}>
          <Button variant="icon" onClick={toggleSort}>
            <p className={styles.title}>SORT BY</p>
            <div className={styles.iconButton}>
              {!sort.isSortOpen ? <PlusIcon /> : <MinusIcon />}
            </div>
          </Button>
        </div>
        {sort.isSortOpen && (
          <div className={styles.sortItem}>
            <button
              type="button"
              onClick={() => handleSortSelect('recently_added')}
              className={getSortClasses('recently_added')}
            >
              Recently added
            </button>
            <button
              type="button"
              onClick={() => handleSortSelect('a_to_z')}
              className={getSortClasses('a_to_z')}
            >
              A-Z
            </button>
            <button
              type="button"
              onClick={() => handleSortSelect('z_to_a')}
              className={getSortClasses('z_to_a')}
            >
              Z-A
            </button>
          </div>
        )}
      </div>

      <div className={styles.buttons}>
        <Button variant="text" onClick={handleApply}>
          SHOW THE RESULTS
        </Button>
        <Button variant="text" onClick={handleClear} disabled={!hasActiveFilters}>
          CLEAR
        </Button>
      </div>
    </div>
  );
};

export default FilterModal;
