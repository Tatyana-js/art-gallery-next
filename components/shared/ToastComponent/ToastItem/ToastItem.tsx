import { Toast } from '@/lib/Context/errorContext';
import { FC } from 'react';
import styles from './ToastItem.module.scss';
import Button from '@/components/ui_kit/Buttons';
import ClearIcon from '@/components/icons/ClearIcon';
import ErrorIcon from '@/components/icons/ErrorIcon';

interface IToastItemProps {
  toast: Toast;
  onClose: (id: string) => void;
}

const ToastItem: FC<IToastItemProps> = ({ toast, onClose }) => (
  <div className={styles.errorContainer} data-toast="true">
    <div className={styles.lineError}></div>
    <p className={styles.errorText}>Error!</p>
    <div className={styles.errorButton}>
      <ErrorIcon />
    </div>
    <p className={styles.message}>{toast.message}</p>
    <div className={styles.closeButton}>
      <Button variant="icon" onClick={() => onClose(toast.id)}>
        <ClearIcon />
      </Button>
    </div>
  </div>
);

export default ToastItem;
