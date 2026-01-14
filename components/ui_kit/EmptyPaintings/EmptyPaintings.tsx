import clsx from 'clsx';
import { FC } from 'react';
import styles from './EmptyPaintings.module.scss';
import Button from '@/components/ui_kit/Buttons';
import PlusIcon from '@/components/icons/PlusIcon';
import EmptyImage from '@/components/image/EmptyImage';

interface IEmptyPaintings {
  onAddPaint: () => void;
  isPaintModalOpen: boolean;
}

const EmptyPaintings: FC<IEmptyPaintings> = ({ onAddPaint, isPaintModalOpen }) => {
  return (
    <>
      <div className={styles.paintings}>
        <div className={styles.emptyContainer}>
          <EmptyImage />
          <div className={styles.addButton}>
            {!isPaintModalOpen && (
              <Button variant="circleIcon" onClick={onAddPaint}>
                <PlusIcon />
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className={styles.messageContainer}>
        <div className={styles.line}></div>
        <p className={clsx(styles.message)}>
          The paintings of this artist have not been uploaded yet.
        </p>
      </div>
    </>
  );
};

export default EmptyPaintings;
