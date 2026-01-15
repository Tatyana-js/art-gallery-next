'use client';

import { FC, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import styles from './PaintingGallery.module.scss';
import EmptyPaintings from '@/components/ui_kit/EmptyPaintings';
import SettingPaintButton from '@/components/shared/SettingPaintButton';
import IArtist from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import Card from '@/components/ui_kit/Card';
import Grid from '@/components/ui_kit/Grid';
import PlusIcon from '@/components/icons/PlusIcon';

import DeleteModal from '@/components/modals/DeleteModal';
// import Pagination from '@/components/shared/Pagination';
import PaintModal from '@/components/modals/PaintModal';
// import Skeletons from '../Skeletons';
import SliderPaintings from '@/components/shared/SliderPaintings';
import { useModalStore } from '@/lib/modalStore/modalStore';

interface IPaintingsGalleryProps {
  artist: IArtist;
  isAuth: boolean;
}

const PaintingsGallery: FC<IPaintingsGalleryProps> = ({ artist, isAuth }) => {
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isEditModal, setEditModal] = useState<boolean>(false);
  const [isSliderOpen, setIsSliderOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isDeleteModal, setDeleteModal] = useState<boolean>(false);

  const { openModal, currentModal } = useModalStore();

  const { paintings } = artist;
  const currentPainting = currentIndex !== null ? paintings[currentIndex] : undefined;

  const isMobile = useMediaQuery('(max-width: 1024px)');

  const handleSetMainPainting = () => {
    // TODO: Implement updateMainPainting API call
  };

  return (
    <>
      <div className={styles.containerPicture}>
        <h3 className={styles.workTitle}>Artworks</h3>
        {isAuth && paintings?.length && (
          <div className={styles.addPicture}>
            <Button variant="text" onClick={() => openModal('painting', { artist })}>
              <PlusIcon />
              ADD PICTURE
            </Button>
          </div>
        )}
        {paintings?.length > 0 ? (
          <Grid>
            {paintings.map((painting, index) => (
              <div
                key={painting._id}
                className={styles.cardContainer}
                onMouseOver={() => {
                  if (!isMobile) setHoveredCardId(painting._id);
                }}
              >
                <Card
                  name={painting.name}
                  details={painting.yearOfCreation}
                  imageSrc={painting.image.src}
                  type="painting"
                  onClick={() => {
                    setIsSliderOpen(true);
                    setCurrentIndex(index);
                  }}
                />
                {isAuth && (isMobile || hoveredCardId === painting._id) && (
                  <SettingPaintButton
                    onEdit={() => {
                      setEditModal(true);
                      setCurrentIndex(index);
                    }}
                    onDelete={() => {
                      setDeleteModal(true);
                      setCurrentIndex(index);
                    }}
                    onSetMainPaint={() => handleSetMainPainting()}
                  />
                )}
              </div>
            ))}
          </Grid>
        ) : (
          <EmptyPaintings
            onAddPaint={() => openModal('painting', { artist })}
            isPaintModalOpen={currentModal.variant === 'painting'}
          />
        )}
      </div>
      {/* {paintings.length >= 6 && (
        <Pagination
          currentIndex={currentIndex ?? 0}
          setCurrentIndex={setCurrentIndex}
          totalPages={paintings.length}
        />
      )} */}
      {isEditModal && (
        <PaintModal
          artistId={artist._id}
          closeModal={() => setEditModal(false)}
          editingPainting={currentIndex !== null ? paintings[currentIndex] : undefined}
        />
      )}
      {isDeleteModal && (
        <DeleteModal
          closeModal={() => setDeleteModal(false)}
          artist={artist}
          type="painting"
          painting={currentIndex !== null ? paintings[currentIndex] : undefined}
        />
      )}
      {isSliderOpen && (
        <SliderPaintings
          artist={artist}
          openSlider={() => {
            setCurrentIndex(null);
            setIsSliderOpen(false);
          }}
          onDeleteModal={() => setDeleteModal(true)}
          onPaintModal={() => setEditModal(true)}
          onSetMainPaint={() => {
            if (currentPainting?._id) {
              handleSetMainPainting();
            }
          }}
          currentIndex={currentIndex}
          onSlideChange={setCurrentIndex}
        />
      )}
    </>
  );
};

export default PaintingsGallery;
