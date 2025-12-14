'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { FC } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import styles from './AuthModal.module.scss';
import type { AuthFormData } from '@/types/types';
import Button from '@/components/ui_kit/Buttons';
import Input from '@/components/ui_kit/Input';
import AuthImage from '@/components/image/AuthImage';
import userSchema from './validate';
import { useModalStore } from '@/lib/modalStore/modalStore';
import { useToast } from '@/hooks/useToast';
import { loginAction } from '@/app/actions/auth-actions';

interface UseFormData {
  username: string;
  password: string;
}

const AuthModal: FC = () => {
  const { closeModal, openModal } = useModalStore();
  const { showError } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<UseFormData>({
    resolver: yupResolver(userSchema),
    mode: 'onSubmit',
  });

  const username = useWatch({ control, name: 'username' });
  const password = useWatch({ control, name: 'password' });
  const isAllUserData = !!(username && password);

  const onSubmit = async (formData: AuthFormData) => {
    try {
      await loginAction(formData.username, formData.password);

      reset();
      closeModal();
    } catch (err) {
      if (err && typeof err === 'object' && 'data' in err) {
        const errorData = err.data as {
          statusCode?: number;
          message?: string;
          error?: string;
        };

        if (errorData.statusCode === 409) {
          showError('Неверный email или пароль');
        } else if (errorData.statusCode === 404) {
          showError('Пользователь с таким email не существует');
        } else {
          showError(errorData.message || 'Ошибка авторизации');
        }
      } else {
        showError('Ошибка авторизации');
      }
    }
  };

  return (
    <>
      <div className={styles.authImage}>
        <AuthImage />
      </div>
      <div className={styles.containerInfo}>
        <h3 className={styles.title}>Welcome back</h3>
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email"
            type="email"
            {...register('username')}
            error={errors.username?.message}
          />
          <Input
            label="Password"
            type="password"
            {...register('password')}
            error={errors.password?.message}
          />
          <div className={styles.buttonContainer}>
            <Button type="submit" variant="defaultButton" disabled={isSubmitting || !isAllUserData}>
              LOG IN
            </Button>
          </div>
        </form>
        <p className={styles.signUpMessage}>
          {`If you don't have an account yet, please `}
          <button
            type="button"
            onClick={() => openModal('registration')}
            className={styles.signUpButtons}
          >
            sign up
          </button>
        </p>
      </div>
    </>
  );
};

export default AuthModal;
