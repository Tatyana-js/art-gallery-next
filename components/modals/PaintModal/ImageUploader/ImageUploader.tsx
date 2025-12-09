import clsx from 'clsx';
import { FC } from 'react';

import styles from './ImageUploader.module.scss';

import type { theme } from '@/types/types';

import Button from '@/ui_kit/Buttons';

import DeleteIcon from '@/assets/icons/DeleteIcon';
import SecondEmptyImg from '@/assets/image/SecondEmptyImg';

interface IImageUploaderProps {
  theme: theme;
  previewUrl: string | null;
  onFilesDrop: (files: File[]) => void;
  onClearImage: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onBrowseClick: () => void;
}

export const ImageUploader: FC<IImageUploaderProps> = ({
  theme,
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
          <img src={previewUrl} alt="Preview" />
          <div className={clsx(styles.deleteButton)}>
            <Button
              variant="icon"
              theme={theme}
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
        <div className={clsx(styles.cardForImg, styles[`cardForImg--${theme}`])}>
          <div className={styles.previewImage}>
            <Button variant="circleIcon" theme={theme}>
              <SecondEmptyImg />
            </Button>
          </div>
          <div className={clsx(styles.textContainer, styles[`textContainer--${theme}`])}>
            <p className={styles.dropMessage}>Drop your image here, or</p>
            <Button variant="text" theme={theme}>
              browse <span className={styles.textButton}>image</span>
            </Button>
            <p className={clsx(styles.uploudMessage, styles[`uploudMessage--${theme}`])}>
              Upload only .jpg or .png format less than 3 MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
