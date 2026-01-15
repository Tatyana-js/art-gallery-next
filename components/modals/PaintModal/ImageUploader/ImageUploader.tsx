import clsx from 'clsx';
import { FC } from 'react';
import styles from './ImageUploader.module.scss';
import Image from 'next/image';
import Button from '@/components/ui_kit/Buttons';

import DeleteIcon from '@/components/icons/DeleteIcon';
import SecondEmptyImg from '@/components/image/SecondEmptyImg';

interface IImageUploaderProps {
  previewUrl: string | null;
  onFilesDrop: (files: File[]) => void;
  onClearImage: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowseClick: () => void;
}

export const ImageUploader: FC<IImageUploaderProps> = ({
  previewUrl,
  onFilesDrop,
  onClearImage,
  onDragOver,
  onDrop,
  onBrowseClick,
}) => {
  return (
    <div
      className={styles.dropContainer}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onBrowseClick}
    >
      {previewUrl ? (
        <>
          <Image
            src={previewUrl}
            alt="Preview"
            fill
            unoptimized
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 768px) 280px, 493px"
          />
          <div className={clsx(styles.deleteButton)}>
            <Button
              variant="icon"
              onClick={(e) => {
                e.stopPropagation();
                onFilesDrop([]);
                onClearImage();
              }}
            >
              <DeleteIcon />
            </Button>
          </div>
        </>
      ) : (
        <div className={styles.cardForImg}>
          <div className={styles.previewImage}>
            <Button variant="circleIcon">
              <SecondEmptyImg />
            </Button>
          </div>
          <div className={styles.textContainer}>
            <p className={styles.dropMessage}>Drop your image here, or</p>
            <Button variant="text">
              browse <span className={styles.textButton}>image</span>
            </Button>
            <p className={styles.uploudMessage}>Upload only .jpg or .png format less than 3 MB</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
