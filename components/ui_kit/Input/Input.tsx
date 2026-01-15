import { forwardRef, useId } from 'react';

import styles from './Input.module.scss';

import ErrorIcon from '@/components/icons/ErrorIcon';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, ...props }, ref) => {
  const autoId = useId();
  const inputId = id ?? autoId;

  return (
    <div className={styles.container}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
        </label>
      )}
      <input ref={ref} id={inputId} className={styles.input} {...props} />
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
});

Input.displayName = 'Input';

export default Input;
