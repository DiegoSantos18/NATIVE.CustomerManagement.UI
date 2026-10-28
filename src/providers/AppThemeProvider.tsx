import { useState, useEffect, useMemo, useCallback, type ReactNode } from 'react';
import { createTheme, MuiThemeProvider } from '@/components/common';
import { ThemeContextProvider } from './ThemeContextProvider';

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme_mode');
    return saved === 'light' || saved === 'dark' ? saved : 'dark';
  });

  useEffect(() => {
    localStorage.setItem('theme_mode', mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  const toggleTheme = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme_mode', next);
      document.documentElement.setAttribute('data-theme', next);
      return next;
    });
  }, []);

  const theme = useMemo(() => {
    const isDark = mode === 'dark';
    return createTheme({
      palette: {
        mode,
        primary: { main: isDark ? '#f36d20' : '#1d4ed8' },
        background: {
          default: isDark ? '#020014' : '#f4f6f8',
          paper: isDark ? '#0a004b' : '#ffffff',
        },
        text: {
          primary: isDark ? '#ffffff' : '#1e293b',
          secondary: isDark ? '#94a3b8' : '#64748b',
        },
      },
    });
  }, [mode]);

  const contextValue = useMemo(() => ({ mode, toggleTheme, theme }), [mode, toggleTheme, theme]);

  return (
    <ThemeContextProvider.Provider value={contextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContextProvider.Provider>
  );
}
