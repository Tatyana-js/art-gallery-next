import useTheme from '@/hooks/useTheme';
import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { usePathname } from 'next/navigation';
import type IArtist from '@/types/Artist';

import styles from './ArtistModal.module.scss';

import EmptyCard from '@/components/shared/EmptyCard';

import { ICreateArtistRequest } from '@/types/Artist';

import getImageSrc from '@/lib/utils/getImageSrc';

import ArtistForm from './ArtistForm/ArtistForm';
import addArtistSchema from './validate';
import { getArtistById } from '@/lib/api/artistsApi';
// import router from 'next/router';
import { useModalStore } from '@/lib/modalStore/modalStore';

const ArtistModal: FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [artist, setArtist] = useState<IArtist | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { theme } = useTheme();
  const { closeModal } = useModalStore();
  const pathname = usePathname();
  const isEditMode = pathname?.includes('/artists/');
  const id = pathname?.split('/')[2];

  useEffect(() => {
    const loadArtist = async () => {
      if (isEditMode && id) {
        setIsLoading(true);
        try {
          const artistData = await getArtistById(id);
          setArtist(artistData);
        } catch (error) {
          console.error('Error loading artist:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadArtist();
  }, [isEditMode, id]);

  const methods = useForm<ICreateArtistRequest>({
    mode: 'onChange',
    resolver: yupResolver(addArtistSchema),
    defaultValues: {
      name: '',
      yearsOfLife: '',
      description: '',
      genres: [],
      location: '',
    },
  });

  useEffect(() => {
    if (artist) {
      methods.reset({
        name: artist.name,
        yearsOfLife: artist.yearsOfLife,
        description: artist.description,
        genres: artist.genres?.map((genre) => genre._id) || [],
        location: artist.location || '',
      });
    }
  }, [artist, methods]);

  useEffect(() => {
    if (artist?.avatar?.src) {
      const avatarUrl = getImageSrc(artist.avatar.src);
      setPreviewUrl(avatarUrl);
    }
  }, [artist]);

  const onSubmit = async (formData: ICreateArtistRequest) => {
    try {
      setIsLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('yearsOfLife', formData.yearsOfLife);
      formDataToSend.append('description', formData.description);

      formData.genres.forEach((genreId: string) => {
        formDataToSend.append('genres', genreId);
      });
      if (selectedFile) {
        formDataToSend.append('avatar', selectedFile);
      }

      // TODO: Implement createArtist and updateArtist API functions
      // if (isEditMode && id) {
      //   responseArtist = await updateArtist(id, formDataToSend);
      // } else {
      //   responseArtist = await createArtist(formDataToSend);
      // }

      methods.reset();
      closeModal();
      // router.replace(`/artists/${responseArtist._id}`);
    } catch (err) {
      if (err instanceof Error) {
        methods.setError('root.serverError', {
          type: 'server',
          message: err.message || 'Failed to save artist',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilesDrop = (files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <FormProvider {...methods}>
      <div
        className={clsx(styles.containerInfo, styles[`containerInfo--${theme}`])}
        onDragOver={handleDragOver}
      >
        <EmptyCard
          onFilesDrop={handleFilesDrop}
          previewUrl={previewUrl}
          isDragOver={isDragOver}
          setIsDragOver={setIsDragOver}
          handleClearImage={handleClearImage}
        />
        <ArtistForm onSubmit={methods.handleSubmit(onSubmit)} isLoading={isLoading} />
      </div>
    </FormProvider>
  );
};

export default ArtistModal;
