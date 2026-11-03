export type NotificationSeverity = 'error' | 'warning' | 'success' | 'info';

export interface Notification {
  severity: NotificationSeverity;
  message: string;
  title?: string;
  duration?: number;
}

export interface NotificationContextData {
  showNotification: (notification: Notification) => void;
}
