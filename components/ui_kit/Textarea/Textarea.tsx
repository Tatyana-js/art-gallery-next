import clsx from "clsx";
import { FC } from "react";
import styles from "./Textarea.module.scss";
import ErrorIcon from "@/public/icons/ErrorIcon";

export interface ITextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

const TextArea: FC<ITextareaProps> = ({ label, error, ...props }) => {
  return (
    <div className={styles.container}>
      <label htmlFor="label" className={styles.label}>
        {label}
      </label>
      <textarea
        id="label"
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
};

export default TextArea;
