'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import clsx from 'clsx';
import { FC } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import styles from './RegisterModal.module.scss';
import type { AuthFormData } from '@/types/types';
import Button from '@/components/ui_kit/Buttons';
import Input from '@/components/ui_kit/Input';
import RegisterImage from '@/components/image/RegisterImage';
import userSchema from './validate';
import { useModalStore } from '@/lib/modalStore/modalStore';
import { useToast } from '@/hooks/useToast';
import { registrationAction } from '@/app/actions/auth-actions';

interface UseFormData {
  username: string;
  password: string;
}

const RegisterModal: FC = () => {
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
    reValidateMode: 'onChange',
  });

 const username = useWatch({ control, name: 'username' });
  const password = useWatch({ control, name: 'password' });
  const isFormReady = !!(username && password);

  const onSubmit = async (formData: AuthFormData) => {
    try {
      await registrationAction(formData.username, formData.password);

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
          showError('Пользователь с таким email уже существует');
        } else {
          showError(errorData.message || 'Ошибка авторизации');
        }
      } else {
        showError('Произошла ошибка при регистрации');
      }
    }
  };

  return (
    <>
      <div className={clsx(styles.authImage)}>
        <RegisterImage />
      </div>
      <div className={styles.containerInfo}>
        <h2 className={styles.title}>Create your profile</h2>
        <form className={styles.formContainer} onSubmit={handleSubmit(onSubmit)} noValidate>
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
            <Button
              variant="defaultButton"
              type="submit"
              disabled={Object.keys(errors).length > 0 || isSubmitting || !isFormReady}
            >
              SIGN UP
            </Button>
          </div>
        </form>
        <p className={styles.loginMessage}>
          If you already have an account, please{' '}
          <button
            type="button"
            onClick={() => openModal('authorization')}
            className={styles.loginbutton}
          >
            log in
          </button>
        </p>
      </div>
    </>
  );
};

export default RegisterModal;
