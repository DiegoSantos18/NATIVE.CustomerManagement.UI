import { createContext } from 'react';
import type { NotificationContextData } from './notification.types';

export const NotificationContext = createContext<NotificationContextData | undefined>(undefined);
