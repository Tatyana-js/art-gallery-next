import { array, object, string } from 'yup';

const addArtistSchema = object().shape({
  name: string().trim().required('Обязательное поле'),
  yearsOfLife: string().required('Обязательное поле'),
  description: string().required('Обязательное поле'),
  location: string().default(''),
  genres: array().min(1, 'Выберите хотя бы один жанр').required('Обязательное поле'),
});

export default addArtistSchema;
