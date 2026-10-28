import { useContext } from 'react';
import { ThemeContextProvider } from '@/providers/ThemeContextProvider';

export function useAppTheme() {
  return useContext(ThemeContextProvider);
}
