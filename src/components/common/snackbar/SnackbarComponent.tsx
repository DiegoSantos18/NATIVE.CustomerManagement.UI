import {
  Alert,
  Box,
  IconButton,
  Snackbar,
  Typography,
  ErrorOutlineIcon,
  WarningAmberIcon,
  CheckCircleIcon,
  InfoIcon,
  CloseIcon,
} from '@/components/common/mui';
import type { ReactNode } from 'react';
import './SnackbarComponent.scss';

export type SnackbarSeverity = 'error' | 'warning' | 'success' | 'info';

interface SnackbarComponentProps {
  open: boolean;
  severity: SnackbarSeverity;
  message: string;
  title?: string;
  duration?: number;
  onClose: () => void;
}

const SEVERITY_CONFIG: Record<SnackbarSeverity, { title: string; icon: ReactNode }> = {
  error: {
    title: 'Erro',
    icon: <ErrorOutlineIcon />,
  },
  warning: {
    title: 'Atenção',
    icon: <WarningAmberIcon />,
  },
  success: {
    title: 'Sucesso',
    icon: <CheckCircleIcon />,
  },
  info: {
    title: 'Informação',
    icon: <InfoIcon />,
  },
};

export function SnackbarComponent({
  open,
  severity,
  message,
  title,
  duration = 5000,
  onClose,
}: SnackbarComponentProps) {
  const config = SEVERITY_CONFIG[severity];

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      className={`app-snackbar app-snackbar--${severity}`}
    >
      <Box className="app-snackbar-container">
        <Box className="app-snackbar-watermark" aria-hidden="true">
          {config.icon}
        </Box>

        <Alert
          icon={false}
          severity={severity}
          className="app-snackbar-alert"
          action={
            <IconButton
              aria-label="Fechar notificação"
              color="inherit"
              size="small"
              onClick={onClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Box className="app-snackbar-content">
            <Box className="app-snackbar-message">
              <Typography className="app-snackbar-title">{title ?? config.title}</Typography>

              <Typography className="app-snackbar-description">{message}</Typography>
            </Box>
          </Box>
        </Alert>

        <Box className="app-snackbar-progress" style={{ animationDuration: `${duration}ms` }} />
      </Box>
    </Snackbar>
  );
}
