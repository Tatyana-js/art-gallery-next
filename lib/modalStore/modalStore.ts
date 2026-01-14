import { create } from 'zustand';
import { ModalVariant } from '@/types/types';
import type IArtist from '@/types/Artist';
import { IPainting } from '@/types/Artist';

interface ModalStore {
  currentModal: {
    variant: ModalVariant | null;
    data?: {
      artist?: IArtist;
      painting?: IPainting;
      type?: string;
    };
  };
  openModal: (
    variant: ModalVariant,
    data?: { artist?: IArtist; painting?: IPainting; type?: string }
  ) => void;
  closeModal: () => void;

  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  currentModal: { variant: null },

  searchValue: '',

  openModal: (variant, data) => {
    set({
      currentModal: { variant, data },
    });
  },

  closeModal: () => {
    set({
      currentModal: { variant: null, data: undefined },
    });
  },

  setSearchValue: (value) => set({ searchValue: value }),
}));
