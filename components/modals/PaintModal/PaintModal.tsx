import clsx from 'clsx';
import { FC, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import styles from './PaintModal.module.scss';
import { ICreatePaintRequest, IPainting } from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import Input from '@/components/ui_kit/Input';
import { addArtistPainting, updateArtistPainting } from '@/lib/api/paintings';

import getImageSrc from '@/lib/utils/getImageSrc';

import ImageUploader from './ImageUploader';

interface IPaintModal {
  artistId: string;
  closeModal: (value: boolean) => void;
  editingPainting?: IPainting;
}

const PaintModal: FC<IPaintModal> = ({ artistId, closeModal, editingPainting }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const router = useRouter();

  const inputFileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICreatePaintRequest>({
    mode: 'onChange',
    defaultValues: editingPainting
      ? {
          name: editingPainting.name,
          yearOfCreation: Number(editingPainting.yearOfCreation),
        }
      : {
          name: '',
          yearOfCreation: undefined,
        },
  });

  const editingPreviewUrl = editingPainting?.image?.src
    ? getImageSrc(editingPainting.image.src)
    : null;

  const handleAddPainting = async (
    artistId: string,
    paintingData: {
      name: string;
      yearOfCreation: number;
    }
  ) => {
    const formData = new FormData();
    formData.append('name', paintingData.name);
    formData.append('yearOfCreation', paintingData.yearOfCreation.toString());

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    try {
      if (editingPainting) {
        await updateArtistPainting(artistId, editingPainting._id, formData);
      } else {
        await addArtistPainting(artistId, formData);
      }
      reset();
      setSelectedFile(null);
      setPreviewUrl(null);
      closeModal(false);
      router.refresh();
    } catch (error) {
      console.error('Ошибка добавления картины:', error);
    }
  };

  const handleBrowseClick = () => {
    inputFileRef.current?.click();
  };

  const onFilesDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesDrop(files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith('image/'));
    if (imageFiles.length > 0) onFilesDrop(imageFiles);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className={clsx(styles.container, 'container')}>
      <form
        className={styles.paintInfo}
        onSubmit={handleSubmit((formData) => handleAddPainting(artistId, formData))}
      >
        <Input
          label="The name of the picture"
          type="name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          label="Year of creation"
          type="text"
          {...register('yearOfCreation')}
          error={errors.yearOfCreation?.message}
        />
        <input
          aria-label="Upload image"
          type="file"
          onChange={handleFileInputChange}
          ref={inputFileRef}
          className={styles.inputFile}
          accept="image/*"
        />
      </form>
      <ImageUploader
        previewUrl={previewUrl ?? editingPreviewUrl}
        onFilesDrop={onFilesDrop}
        onClearImage={handleClearImage}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onBrowseClick={handleBrowseClick}
      />
      <Button
        variant="defaultButton"
        type="submit"
        onClick={handleSubmit((formData) => handleAddPainting(artistId, formData))}
      >
        SAVE
      </Button>
    </div>
  );
};

export default PaintModal;
