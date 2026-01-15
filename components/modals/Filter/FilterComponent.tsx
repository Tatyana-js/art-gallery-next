'use client';

import useMediaQuery from '@/hooks/useMediaQuery';
import { FC } from 'react';
import styles from './FilterComponent.module.scss';

import Button from '@/components/ui_kit/Buttons';
import ClearIcon from '@/components/icons/ClearIcon';

import FilterModal from './FilterModal';
import { useModalStore } from '@/lib/modalStore/modalStore';

const FilterComponent: FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { filterState, setFilterState } = useModalStore();

  if (isMobile || !filterState.isOpen) return null;

  return (
    <>
      <div
        className={styles.overlay}
        onClick={() => setFilterState((prev) => ({ ...prev, isOpen: false }))}
        aria-hidden="true"
      />
      <div className={styles.filterWrapper}>
        <FilterModal />
        <div className={styles.closeButton}>
          <Button
            variant="icon"
            onClick={() =>
              setFilterState((prev) => ({
                ...prev,
                isOpen: false,
              }))
            }
          >
            <ClearIcon />
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterComponent;
