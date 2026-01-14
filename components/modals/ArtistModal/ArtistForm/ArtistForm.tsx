import { BaseSyntheticEvent, FC, useEffect, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
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
    register,
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
      <Input
        label="Name*"
        type="name"
        {...register('name')}
        placeholder="Ivan Aivazovsky"
        error={errors.name?.message}
      />
      <Input
        label="Years of life"
        type="text"
        {...register('yearsOfLife')}
        error={errors.yearsOfLife?.message}
      />
      <Input label="Location" type="text" {...register('location')} />
      <TextArea
        label="Description"
        {...register('description')}
        error={errors.description?.message}
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
