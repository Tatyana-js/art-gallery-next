'use client';

import { useContext } from 'react';

import { IThemeContext, ThemeContext } from '@/lib/Context/context';

const useTheme = (): IThemeContext => useContext(ThemeContext);

export default useTheme;
