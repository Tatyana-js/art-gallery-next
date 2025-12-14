import { ToastContext } from '@/lib/Context/errorContext';
import { use } from 'react';

export const useToast = () => {
  const context = use(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
