import { useCallback, useState, type ReactNode } from 'react';
import { SnackbarComponent } from '@/components/common/snackbar/SnackbarComponent';
import { NotificationContext } from './NotificationContext';
import type { Notification } from './notification.types';

interface NotificationProviderProps {
  children: ReactNode;
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notification, setNotification] = useState<Notification | null>(null);
  const [notificationKey, setNotificationKey] = useState(0);

  const showNotification = useCallback((newNotification: Notification) => {
    setNotification(newNotification);
    setNotificationKey((current) => current + 1);
  }, []);

  const handleClose = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}

      {notification && (
        <SnackbarComponent
          key={notificationKey}
          open
          severity={notification.severity}
          message={notification.message}
          title={notification.title}
          duration={notification.duration}
          onClose={handleClose}
        />
      )}
    </NotificationContext.Provider>
  );
}
