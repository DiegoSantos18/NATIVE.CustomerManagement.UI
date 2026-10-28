import { createContext } from 'react';
import { type Theme } from '@/components/common';

interface ThemeContextData {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  theme: Theme;
}

export const ThemeContextProvider = createContext<ThemeContextData>({} as ThemeContextData);
