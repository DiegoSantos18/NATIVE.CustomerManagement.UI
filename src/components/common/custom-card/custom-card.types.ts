import type { ReactNode } from 'react';

export interface CustomCardComponentProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  footerInfo?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}
