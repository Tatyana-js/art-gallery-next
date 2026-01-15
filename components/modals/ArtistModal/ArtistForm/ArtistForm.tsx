import { BaseSyntheticEvent, FC, useEffect, useState } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import styles from './ArtistForm.module.scss';
import Loader from '@/components/ui_kit/Loader';
import { ICreateArtistRequest, IGenre } from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import Input from '@/components/ui_kit/Input';
import MultiSelect from '@/components/ui_kit/MultiSelect';
import TextArea from '@/components/ui_kit/Textarea';
import { getGenres } from '@/lib/api/genres';

interface IArtistFormProps {
  onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
  isLoading: boolean;
}

const AddArtistForm: FC<IArtistFormProps> = ({ onSubmit, isLoading }) => {
  const {
    formState: { errors },
    setValue,
    control,
  } = useFormContext<ICreateArtistRequest>();

  const [genresData, setGenresData] = useState<IGenre[]>([]);

  useEffect(() => {
    const loadGenres = async () => {
      const genres = await getGenres();
      setGenresData(genres);
    };
    loadGenres();
  }, []);

  const selectedGenreIds = useWatch({
    control,
    name: 'genres',
    defaultValue: [],
  }) as string[];

  const handleGenresChange = (genreIds: string[]) => {
    setValue('genres', genreIds, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
  };

  return (
    <form className={styles.formContainer} onSubmit={onSubmit}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
      <Input
        label="Name*"
            type="text"
        placeholder="Ivan Aivazovsky"
        error={errors.name?.message}
            {...field}
            value={field.value ?? ''}
          />
        )}
      />

      <Controller
        name="yearsOfLife"
        control={control}
        render={({ field }) => (
      <Input
        label="Years of life"
        type="text"
        error={errors.yearsOfLife?.message}
            {...field}
            value={field.value ?? ''}
          />
        )}
      />

      <Controller
        name="location"
        control={control}
        render={({ field }) => (
          <Input label="Location" type="text" {...field} value={field.value ?? ''} />
        )}
      />

      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <TextArea label="Description" error={errors.description?.message} {...field} />
        )}
      />
      <MultiSelect
        genres={genresData}
        selectedGenres={selectedGenreIds}
        onGenresChange={handleGenresChange}
      />
      <div className={styles.buttonContainer}>
        <Button type="submit" variant="defaultButton" disabled={isLoading}>
          {isLoading ? <Loader /> : 'SAVE'}
        </Button>
      </div>
    </form>
  );
};

export default AddArtistForm;
