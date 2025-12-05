export type theme = 'dark' | 'light';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  data: AuthTokens;
}

export interface AuthFormData {
  email: string;
  password: string;
}

export interface ArtistsQueryParams {
  genres?: string[];
  orderBy?: string;
  direction?: 'asc' | 'desc';
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
