export type theme = 'dark' | 'light';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  data: AuthTokens;
}

export interface AuthFormData {
  username: string;
  password: string;
}

export interface ArtistsQueryParams {
  search?: string;
  genres?: string[];
  sort?: 'a_to_z' | 'z_to_a' | null;
  name?: string;
}

export interface IFilterModalState {
  isOpen: boolean;
  genres: {
    isListOpen: boolean;
    selectedGenres: string[];
  };
  sort: {
    isSortOpen: boolean;
    selected: string | null;
  };
}

export type ModalVariant =
  | 'menuModal'
  | 'authorization'
  | 'registration'
  | 'addArtist'
  | 'deleteArtist'
  | 'painting'
  | 'slider'
  | 'filter';
