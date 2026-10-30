import { useState, type MouseEvent } from 'react';
import { useAppTheme, useNotification } from '@/hooks';
import {
  DarkModeIcon,
  LightModeIcon,
  PersonIcon,
  LogoutIcon,
  Tooltip,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@/components/common/mui';
import './HeaderComponent.scss';

export function HeaderComponent() {
  const { mode, toggleTheme } = useAppTheme();
  const { showNotification } = useNotification();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = Boolean(anchorEl);

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // TODO: Implementar funcionalidades futuras
  const handleNotImplemented = () => {
    handleCloseMenu();

    showNotification({
      severity: 'info',
      message: 'Funcionalidade não implementada.',
    });
  };

  return (
    <header className="app-header">
      <div className="header-left">{/* TODO: Implementar funcionalidades futuras */}</div>

      <div className="header-right">
        <Tooltip title={mode === 'dark' ? 'Modo Claro' : 'Modo Escuro'}>
          <IconButton onClick={toggleTheme} color="inherit" size="medium">
            {mode === 'dark' ? (
              <LightModeIcon fontSize="small" />
            ) : (
              <DarkModeIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <div className="user-profile">
          <Tooltip title="Ver Perfil">
            <IconButton
              onClick={handleOpenMenu}
              size="small"
              aria-label="Abrir menu do usuário"
              aria-controls={open ? 'user-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ ml: 1 }}
            >
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: 'var(--primary)',
                  color: 'var(--bg-primary)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  boxShadow: 'var(--shadow-elevation)',
                }}
              >
                DS
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            id="user-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleCloseMenu}
            slotProps={{
              paper: {
                sx: {
                  backgroundColor: 'var(--bg-primary)',
                  backgroundImage: 'none',
                  color: 'var(--text-main)',
                  border: '1px solid var(--border-color)',
                  boxShadow: 'var(--shadow-elevation)',
                  mt: 1,
                  minWidth: 180,
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={handleNotImplemented}>
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: 'var(--text-muted)' }} />
              </ListItemIcon>

              <ListItemText primary="Meu Perfil" />
            </MenuItem>

            <Divider sx={{ borderColor: 'var(--border-color)' }} />

            <MenuItem onClick={handleNotImplemented}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: 'var(--primary)' }} />
              </ListItemIcon>

              <ListItemText primary="Sair" sx={{ color: 'var(--primary)' }} />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}
