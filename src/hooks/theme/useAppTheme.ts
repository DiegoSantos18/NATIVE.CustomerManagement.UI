import { useContext } from 'react';
import { ThemeContextProvider } from '@/providers/theme/ThemeContextProvider';

export function useAppTheme() {
  return useContext(ThemeContextProvider);
}
