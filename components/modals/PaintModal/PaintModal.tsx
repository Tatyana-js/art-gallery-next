import {
  useAddArtistPaintingMutation,
  useUpdateArtistPaintingMutation,
} from '@/store/api/artistsApi';
import clsx from 'clsx';
import { FC, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import styles from './PaintModal.module.scss';

import { ICreatePaintRequest, IPainting } from '@/types/Artist';
import type { theme } from '@/types/types';

import Button from '@/ui_kit/Buttons';
import Input from '@/ui_kit/Input';

import getImageSrc from '@/utils/getImageSrc';

import ImageUploader from './ImageUploader';

interface IPaintModal {
  theme: theme;
  artistId: string;
  closeModal: (value: boolean) => void;
  editingPainting?: IPainting;
}

const PaintModal: FC<IPaintModal> = ({ theme, artistId, closeModal, editingPainting }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [addPainting] = useAddArtistPaintingMutation();
  const [updatePainting] = useUpdateArtistPaintingMutation();

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

  useEffect(() => {
    if (editingPainting?.image?.src) {
      const imageUrl = getImageSrc(editingPainting.image.src);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [editingPainting]);

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
        await updatePainting({
          id: artistId,
          paintingId: editingPainting._id,
          data: formData,
        }).unwrap();
      } else {
        await addPainting({
          id: artistId,
          data: formData,
        }).unwrap();
      }
      reset();
      closeModal(false);
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
        className={clsx(styles.paintInfo, styles[`paintInfo--${theme}`])}
        onSubmit={handleSubmit((formData) => handleAddPainting(artistId, formData))}
      >
        <Input
          theme={theme}
          label="The name of the picture"
          type="name"
          {...register('name')}
          error={errors.name?.message}
        />
        <Input
          theme={theme}
          label="Year of creation"
          type="text"
          {...register('yearOfCreation')}
          error={errors.yearOfCreation?.message}
        />
        <input
          type="file"
          onChange={handleFileInputChange}
          ref={inputFileRef}
          className={styles.inputFile}
          accept="image/*"
        />
      </form>
      <ImageUploader
        theme={theme}
        previewUrl={previewUrl}
        onFilesDrop={onFilesDrop}
        onClearImage={handleClearImage}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onBrowseClick={handleBrowseClick}
      />
      <Button
        variant="defaultButton"
        theme={theme}
        type="submit"
        onClick={handleSubmit((formData) => handleAddPainting(artistId, formData))}
      >
        SAVE
      </Button>
    </div>
  );
};

export default PaintModal;
