import { InferType, object, string } from 'yup';

const userSchema = object().shape({
  username: string().trim().email('Введите корректный email').required('Обязательное поле'),
  password: string().required('Обязательное поле').min(3, 'Не менее 3 символов'),
});

export type UserFormData = InferType<typeof userSchema>;
export default userSchema;
