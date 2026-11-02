import { useEffect } from 'react';
import { useAppTheme } from '@/hooks/theme/useAppTheme';
import { FaviconDarkPNG, FaviconLightPNG } from '@/assets';

export function FaviconProvider() {
  const { mode } = useAppTheme();

  useEffect(() => {
    const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

    if (link) {
      link.href = mode === 'dark' ? FaviconLightPNG : FaviconDarkPNG;
    }
  }, [mode]);

  return null;
}
