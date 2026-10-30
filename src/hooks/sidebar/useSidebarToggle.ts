import { useState, useEffect } from 'react';

const SIDEBAR_STORAGE_KEY = 'native_sidebar_collapsed';

export function useSidebarToggle() {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(collapsed));
  }, [collapsed]);

  const toggle = () => setCollapsed((prev) => !prev);

  return { collapsed, toggle };
}
