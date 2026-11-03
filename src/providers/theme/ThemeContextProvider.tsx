import { createContext } from 'react';
import { type Theme } from '@/components/common/mui';

interface ThemeContextData {
  mode: 'light' | 'dark';
  toggleTheme: () => void;
  theme: Theme;
}

export const ThemeContextProvider = createContext<ThemeContextData>({} as ThemeContextData);
