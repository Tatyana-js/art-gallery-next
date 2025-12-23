'use client';

import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { Toast, ToastContext, ToastContextType } from './errorContext';
import ToastComponent from '@/components/shared/ToastComponent';

export interface IToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: FC<IToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const MAX_TOASTS = 3;

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showError = useCallback(
    (message: string, duration = 5000) => {
      const toastId = Math.random().toString(36).substring(2, 9);

      setToasts((prev) => {
        const updatedToasts =
          prev.length >= MAX_TOASTS
            ? [...prev.slice(1), { id: toastId, message, duration }]
            : [...prev, { id: toastId, message, duration }];

        return updatedToasts;
      });

      if (duration > 0) {
        setTimeout(() => {
          removeToast(toastId);
        }, duration);
      }
    },
    [removeToast, MAX_TOASTS]
  );

  const value: ToastContextType = useMemo(
    () => ({
      toasts,
      showError,
      removeToast,
    }),
    [toasts, showError, removeToast]
  );

  return (
    <ToastContext value={value}>
      {children}
      <ToastComponent toasts={toasts} removeToast={removeToast} />
    </ToastContext>
  );
};
export { ToastComponent };
