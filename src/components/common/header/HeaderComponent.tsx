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
  const handleNotImplemented = (name: string) => {
    handleCloseMenu();

    showNotification({
      severity: 'info',
      message: `Funcionalidade '${name}' não implementada.`,
    });
  };

  const menuItemStyles = {
    minHeight: 44,
    px: 2,
    color: 'var(--text-secondary)',
    transition: 'background-color 0.2s ease, color 0.2s ease',

    '&:hover': {
      color: 'var(--primary)',
      backgroundColor: 'var(--bg-surface-hover)',
    },

    '&.Mui-focusVisible': {
      backgroundColor: 'var(--bg-surface-hover)',
    },

    '& .MuiListItemIcon-root': {
      minWidth: 36,
      color: 'var(--text-muted)',
      transition: 'color 0.2s ease',
    },

    '&:hover .MuiListItemIcon-root': {
      color: 'var(--primary)',
    },

    '& .MuiListItemText-primary': {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
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
                  color: 'var(--primary-contrast)',
                  fontWeight: 700,
                  fontSize: '0.875rem',
                  boxShadow: 'var(--shadow-elevation)',
                }}
              >
                <PersonIcon fontSize="small" />
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
                  mt: 1,
                  minWidth: 190,
                  overflow: 'hidden',
                  color: 'var(--text-main)',
                  backgroundColor: 'var(--bg-surface-raised)',
                  backgroundImage: 'none',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  boxShadow: 'var(--shadow-modal)',
                  transition: 'background-color 0.25s ease, border-color 0.25s ease',

                  '& .MuiList-root': {
                    padding: '0.4rem',
                  },
                },
              },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem onClick={() => handleNotImplemented('Meu Perfil')} sx={menuItemStyles}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText primary="Meu Perfil" />
            </MenuItem>

            <Divider
              sx={{
                my: 0.5,
                borderColor: 'var(--border-color)',
              }}
            />

            <MenuItem
              onClick={() => handleNotImplemented('Sair')}
              sx={{
                ...menuItemStyles,
                color: 'var(--primary)',

                '& .MuiListItemIcon-root': {
                  minWidth: 36,
                  color: 'var(--primary)',
                },

                '&:hover': {
                  color: 'var(--primary-hover)',
                  backgroundColor: 'var(--bg-surface-hover)',
                },

                '&:hover .MuiListItemIcon-root': {
                  color: 'var(--primary-hover)',
                },
              }}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>

              <ListItemText primary="Sair" />
            </MenuItem>
          </Menu>
        </div>
      </div>
    </header>
  );
}
