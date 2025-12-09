'use client';

import { createContext } from 'react';

import type { theme } from '@/types/types';

export interface IThemeContext {
  theme: theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext>({
  theme: 'dark' as theme,
  toggleTheme: () => {},
});
