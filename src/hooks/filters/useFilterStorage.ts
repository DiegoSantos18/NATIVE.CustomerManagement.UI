import { useState, useEffect } from 'react';

export function useFilterStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [storedFilter, setStoredFilter] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (Array.isArray(storedFilter) && storedFilter.length === 0) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(storedFilter));
      }
    } catch {
      // Ignore write errors
    }
  }, [key, storedFilter]);

  return [storedFilter, setStoredFilter];
}
