import { useContext } from 'react';
import { NotificationContext } from '@/providers/notification';

export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification deve ser utilizado dentro de NotificationProvider.');
  }

  return context;
}
