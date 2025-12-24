import { Toast } from '@/lib/Context/errorContext';
import { FC } from 'react';
import { createPortal } from 'react-dom';
import styles from './ToastComponent.module.scss';
import Button from '@/components/ui_kit/Buttons';
import ClearIcon from '@/components/icons/ClearIcon';
import ErrorIcon from '@/components/icons/ErrorIcon';

interface IToastComponentProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastComponent: FC<IToastComponentProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.errorContainer} ${styles.toast}`}
          data-toast="true"
        >
          <div className={styles.lineError}></div>
          <div className={styles.content}>
            <p className={styles.errorText}>Error!</p>
            <p className={styles.message}>{toast.message}</p>
          </div>
          <div className={styles.errorButton}>
            <ErrorIcon />
          </div>
          <div className={styles.closeButton}>
            <Button variant="icon" onClick={() => removeToast(toast.id)}>
              <ClearIcon />
            </Button>
          </div>
        </div>
      ))}
    </div>,
    document.body
  );
};

export default ToastComponent;
