import clsx from 'clsx';
import { forwardRef, useId } from 'react';
import styles from './Textarea.module.scss';
import ErrorIcon from '@/components/icons/ErrorIcon';

export interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextArea = forwardRef<HTMLTextAreaElement, ITextareaProps>(
  ({ label, error, id, ...props }, ref) => {
    const autoId = useId();
    const textareaId = id ?? autoId;

    return (
      <div className={styles.container}>
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
        <textarea
          ref={ref}
          id={textareaId}
          className={clsx(styles.textarea, error && styles.textareaError)}
          {...props}
        />
        {error && (
          <div className={styles.errorContainer}>
            <div className={styles.iconContainer}>
              <ErrorIcon />
            </div>
            <p className={styles.errorMessage}>{error}</p>
          </div>
        )}
      </div>
    );
  }
);

TextArea.displayName = 'TextArea';

export default TextArea;
