import { Toast } from '@/lib/Context/errorContext';
import { FC } from 'react';
import { createPortal } from 'react-dom';
import styles from './ToastComponent.module.scss';
import ToastItem from './ToastItem/ToastItem';

interface IToastComponentProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

const ToastComponent: FC<IToastComponentProps> = ({ toasts, removeToast }) => {
  if (toasts.length === 0) return null;

  return createPortal(
    <div className={styles.toastContainer}>
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>,
    document.body
  );
};

export default ToastComponent;
