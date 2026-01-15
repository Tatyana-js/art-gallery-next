import { create } from 'zustand';
import { IFilterModalState, ModalVariant } from '@/types/types';
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

  filterState: IFilterModalState;
  setFilterState: (updater: (prev: IFilterModalState) => IFilterModalState) => void;

  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const useModalStore = create<ModalStore>((set) => ({
  currentModal: { variant: null },

  filterState: {
    isOpen: false,
    genres: { isListOpen: false, selectedGenres: [] },
    sort: { isSortOpen: false, selected: null },
  },

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

  setFilterState: (updater) =>
    set((state) => ({
      filterState: updater(state.filterState),
    })),

  setSearchValue: (value) => set({ searchValue: value }),
}));
