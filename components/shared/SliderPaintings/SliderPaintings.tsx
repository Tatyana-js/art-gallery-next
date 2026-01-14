import { FC } from 'react';
import Image from 'next/image';
import styles from './SliderPaintings.module.scss';
import IArtist, { IPainting } from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import ClearIcon from '@/components/icons/ClearIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import EditIcon from '@/components/icons/EditIcon';
import PreviewIcon from '@/components/icons/PreviewIcon';
import AnimatedImage from './AnimatedImage';

interface ISliderPaintingsProps {
  artist: IArtist;
  onDeleteModal: (painting: IPainting) => void;
  onPaintModal: () => void;
  currentIndex: number | null;
  onSlideChange: (index: number) => void;
  openSlider: () => void;
  onSetMainPaint: () => void;
}

const SliderPaintings: FC<ISliderPaintingsProps> = ({
  artist,
  onDeleteModal,
  onPaintModal,
  currentIndex,
  onSlideChange,
  openSlider,
  onSetMainPaint,
}) => {
  const { paintings, mainPainting } = artist;
  const currentPainting = currentIndex !== null ? paintings[currentIndex] : undefined;

  if (!currentPainting) {
    return null;
  }

  const pageCounterText =
    currentIndex !== null && paintings.length > 0
      ? `${currentIndex + 1} / ${paintings.length}`
      : '0 / 0';
  const { name, yearOfCreation } = currentPainting;
  const isMainPaint = currentPainting._id === mainPainting?._id;

  return (
    <div className={styles.container}>
      <div className={styles.mainImageContainer}>
        <AnimatedImage
          currentPainting={currentPainting}
          onSlideChange={onSlideChange}
          currentIndex={currentIndex!}
          paintings={paintings}
        />
        {!isMainPaint && (
          <div className={styles.setContainer}>
            <div className={styles.previewIcon}>
              <Button variant="icon" onClick={onSetMainPaint}>
                <PreviewIcon />
              </Button>
            </div>
            <Button variant="text" onClick={onSetMainPaint}>
              SET THE COVER
            </Button>
          </div>
        )}
        <button
          type="button"
          aria-label="Close modal"
          className={styles.clearButton}
          onClick={openSlider}
        >
          <ClearIcon />
        </button>
        <div className={styles.infoContainer}>
          <div className={styles.line}></div>
          <p className={styles.details}>{yearOfCreation}</p>
          <p>{name}</p>
        </div>
        <div className={styles.editButtons}>
          <Button variant="icon" onClick={onPaintModal}>
            <EditIcon />
          </Button>
          <Button variant="icon" onClick={() => onDeleteModal(currentPainting)}>
            <DeleteIcon />
          </Button>
        </div>
        <div className={styles.pageCounter}>{pageCounterText}</div>
      </div>
      <div className={styles.thumbnails}>
        {paintings.map((painting, index) => (
          <div
            key={painting._id}
            className={styles.thumbnailWrapper}
            onClick={() => onSlideChange(index)}
          >
            <Image
              src={painting.image.src}
              alt={painting.name}
              fill
              priority={true}
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SliderPaintings;
