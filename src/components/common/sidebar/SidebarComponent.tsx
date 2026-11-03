import { useState, useEffect, useTransition } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  DashboardIcon,
  PeopleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ExpandMoreIcon,
  ExpandLessIcon,
  IconButton,
  Tooltip,
  Collapse,
} from '@/components/common/mui';
import { FooterComponent } from '../footer/FooterComponent';
import { LogoDarkPNG, LogoLightPNG } from '@/assets';
import { useAppTheme } from '@/hooks';
import './SidebarComponent.scss';

interface SidebarComponentProps {
  collapsed: boolean;
  toggle: () => void;
}

export function SidebarComponent({ collapsed, toggle }: SidebarComponentProps) {
  const { mode } = useAppTheme();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(() => {
    return window.location.pathname.startsWith('/customers') ? 'customers' : null;
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (!location.pathname.startsWith('/customers')) {
        setOpenGroup(null);
      }
    });
  }, [location.pathname]);

  const isCustomersActive = location.pathname.startsWith('/customers');

  const handleToggleGroup = () => {
    if (collapsed) {
      toggle();
      setOpenGroup('customers');
      return;
    }

    setOpenGroup((current) => (current === 'customers' ? null : 'customers'));
  };

  const handleItemClick = () => {
    if (!collapsed) {
      toggle();
    }
  };

  const logo = mode === 'dark' ? LogoLightPNG : LogoDarkPNG;

  return (
    <>
      {!collapsed && (
        <div className="sidebar-mobile-backdrop" onClick={toggle} aria-hidden="true" />
      )}

      {collapsed && (
        <IconButton
          onClick={toggle}
          size="small"
          className="mobile-float-toggle"
          aria-label="Abrir menu"
        >
          <img src={logo} alt="" />
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      )}

      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`} aria-label="Menu principal">
        <div className="sidebar-brand">
          <Link
            to="/"
            className="brand-wrapper"
            onClick={handleItemClick}
            aria-label="Página inicial"
          >
            <img src={logo} alt="" className="brand-logo" />

            {!collapsed && <span className="brand-title">{import.meta.env.VITE_APP_NAME}</span>}
          </Link>

          <Tooltip title={collapsed ? 'Expandir menu' : 'Recolher menu'}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggle();
              }}
              size="small"
              className="edge-toggle-btn"
              aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
              aria-expanded={!collapsed}
            >
              {collapsed ? (
                <ChevronRightIcon fontSize="small" />
              ) : (
                <ChevronLeftIcon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </div>

        <nav className="sidebar-nav" aria-label="Navegação">
          <Tooltip title={collapsed ? 'Dashboard' : ''} placement="right" arrow>
            <Link
              to="/"
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={handleItemClick}
              aria-current={location.pathname === '/' ? 'page' : undefined}
            >
              <DashboardIcon className="nav-icon" />

              {!collapsed && <span className="nav-label">Dashboard</span>}
            </Link>
          </Tooltip>

          <div className="nav-group">
            <Tooltip title={collapsed ? 'Clientes' : ''} placement="right" arrow>
              <button
                type="button"
                className={`nav-item nav-group-trigger ${isCustomersActive ? 'active' : ''}`}
                onClick={handleToggleGroup}
                aria-expanded={!collapsed && openGroup === 'customers'}
                aria-controls="customers-submenu"
              >
                <PeopleIcon className="nav-icon" />

                {!collapsed && (
                  <>
                    <span className="nav-label">Clientes</span>

                    <span className="arrow-icon">
                      {openGroup === 'customers' ? (
                        <ExpandLessIcon fontSize="small" />
                      ) : (
                        <ExpandMoreIcon fontSize="small" />
                      )}
                    </span>
                  </>
                )}
              </button>
            </Tooltip>

            {!collapsed && (
              <Collapse in={openGroup === 'customers'} timeout="auto" unmountOnExit>
                <div className="submenu" id="customers-submenu">
                  <Link
                    to="/customers"
                    className={`sub-nav-item ${location.pathname === '/customers' ? 'active' : ''}`}
                    onClick={handleItemClick}
                    aria-current={location.pathname === '/customers' ? 'page' : undefined}
                  >
                    Listagem de Clientes
                  </Link>
                </div>
              </Collapse>
            )}
          </div>
        </nav>

        {!collapsed && (
          <div className="sidebar-mobile-footer">
            <FooterComponent variant="sidebar" />
          </div>
        )}
      </aside>
    </>
  );
}
