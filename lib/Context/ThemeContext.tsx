'use client';
import { setCookie } from 'cookies-next';
import { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import type { theme } from '@/types/types';
import { ThemeContext } from './context';

export interface IThemeProviderProps {
  children: ReactNode;
  defaultTheme?: theme;
}

const ThemeProvider = ({ children, defaultTheme = 'dark' }: IThemeProviderProps) => {
  const [theme, setTheme] = useState(defaultTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  useEffect(() => {
    // Применяем класс темы к body
    const body = document.body;
    body.classList.remove('light', 'dark');
    body.classList.add(theme);

    // Сохраняем в cookie
    setCookie('theme', theme, {
      maxAge: 60 * 60 * 24 * 365,
      path: '/',
    });
  }, [theme]);

  const contextValue = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);

  return <ThemeContext value={contextValue}>{children}</ThemeContext>;
};

export default ThemeProvider;
