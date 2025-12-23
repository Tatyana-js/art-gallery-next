/* eslint-disable @next/next/no-img-element */
import clsx from 'clsx';
import { FC, useRef } from 'react';
import styles from './EmptyCard.module.scss';
import Button from '@/components/ui_kit/Buttons';
import DeleteIcon from '@/components/icons/DeleteIcon';
import AddArtistPhoto from '@/components/image/AddArtistPhoto';

interface IEmptyCardProps {
  onFilesDrop: (files: File[]) => void;
  previewUrl?: string | null;
  isDragOver?: boolean;
  setIsDragOver: (arg0: boolean) => void;
  handleClearImage: () => void;
}

const EmptyCard: FC<IEmptyCardProps> = ({
  onFilesDrop,
  previewUrl,
  isDragOver = false,
  setIsDragOver,
  handleClearImage,
}) => {
  const inputFileRef = useRef<HTMLInputElement>(null);

  const handleBrowseClick = () => {
    inputFileRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesDrop(files);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0) onFilesDrop(imageFiles);
  };

  return (
    <div className={clsx(styles.columnLeft)}>
      <input
        aria-label="Empty card input"
        type="file"
        ref={inputFileRef}
        onChange={handleFileInputChange}
        accept="image/*"
      />
      <div
        className={clsx(styles.image, isDragOver && styles.imageDrag)}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        {isDragOver ? (
          <div className={styles.dragOverState}>
            <AddArtistPhoto />
            <div className={styles.messageContainer}>
              <p className={styles.dropMessage}>Drop your image here</p>
              <p className={styles.uploadMessage}>Upload only .jpg or .png format less than 3 MB</p>
            </div>
          </div>
        ) : previewUrl ? (
          <>
            <img src={previewUrl || ''} alt="Preview" className={styles.previewImage} />
            <div className={clsx(styles.deleteButton)}>
              <Button
                variant="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onFilesDrop([]);
                  handleClearImage();
                }}
              >
                <DeleteIcon />
              </Button>
            </div>
          </>
        ) : (
          <div className={styles.emptyContainer}>
            <AddArtistPhoto />
            <p className={styles.emptyCardMessage}>You can drop your image here</p>
          </div>
        )}
      </div>
      <Button variant="text" onClick={handleBrowseClick}>
        BROWSE PROFILE PHOTO
      </Button>
    </div>
  );
};

export default EmptyCard;
