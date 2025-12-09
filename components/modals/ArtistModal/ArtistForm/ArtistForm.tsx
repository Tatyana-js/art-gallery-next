import { useGetGenresQuery } from '@/store/api/artistsApi';
import { BaseSyntheticEvent, FC, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import styles from './ArtistForm.module.scss';

import Loader from '@/components/Loader';

import { ICreateArtistRequest } from '@/types/Artist';
import type { theme } from '@/types/types';

import Button from '@/ui_kit/Buttons';
import Input from '@/ui_kit/Input';
import MultiSelect from '@/ui_kit/MultiSelect';
import TextArea from '@/ui_kit/Textarea';

interface IArtistFormProps {
  theme: theme;
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
}

const AddArtistForm: FC<IArtistFormProps> = ({ theme, onSubmit, isLoading }) => {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ICreateArtistRequest>();

  const { data: genresData } = useGetGenresQuery();
  const selectedGenreIds = watch('genres') || [];

  const genres = useMemo(() => genresData || [], [genresData]);

  const handleGenresChange = (genreIds: string[]) => {
    setValue('genres', genreIds, { shouldValidate: true });
  };

  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <Input
        label="Name*"
        theme={theme}
        type="name"
        {...register('name')}
        placeholder="Ivan Aivazovsky"
        error={errors.name?.message}
      />
      <Input
        label="Years of life"
        theme={theme}
        type="text"
        {...register('yearsOfLife')}
        error={errors.yearsOfLife?.message}
      />
      <Input label="Location" theme={theme} type="text" {...register('location')} />
      <TextArea
        label="Description"
        theme={theme}
        {...register('description')}
        error={errors.description?.message}
      />
      <MultiSelect
        genres={genres || []}
        theme={theme}
        selectedGenres={selectedGenreIds}
        onGenresChange={handleGenresChange}
      />
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="defaultButton" theme={theme} disabled={isLoading}>
          {isLoading ? <Loader theme={theme} /> : 'SAVE'}
        </Button>
      </div>
    </form>
  );
};

export default AddArtistForm;
