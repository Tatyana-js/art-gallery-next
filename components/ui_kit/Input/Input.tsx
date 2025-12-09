import { FC, useId } from 'react';

import styles from './Input.module.scss';

import ErrorIcon from '@/components/icons/ErrorIcon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: FC<InputProps> = ({ label, error, ...props }) => {
  const id = useId();

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}
      <input id={id} className={styles.input} {...props} />
      {error && (
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>
            <ErrorIcon />
          </div>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}
    </div>
  );
};

export default Input;
