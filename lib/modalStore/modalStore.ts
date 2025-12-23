import { create } from 'zustand';
import { ModalVariant } from '@/types/types';

interface ModalStore {
  currentModal: {
    variant: ModalVariant | null;
  };
  openModal: (variant: ModalVariant) => void;
  closeModal: () => void;

  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  currentModal: { variant: null },

  searchValue: '',

  openModal: (variant) => {
    set({
      currentModal: { variant },
    });
  },

  closeModal: () => {
    set({
      currentModal: { variant: null },
    });
  },

  setSearchValue: (value) => set({ searchValue: value }),
}));
