import { createContext } from 'react';

export interface Toast {
  id: string;
  message: string;
  duration?: number;
}

export interface ToastContextType {
  toasts: Toast[];
  showError: (message: string) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined
);
