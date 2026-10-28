import { useState, useTransition } from 'react';
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
  FooterComponent,
} from '@/components/common';
import { LogoDarkPNG, LogoLightPNG } from '@/assets';
import { useSidebarToggle, useAppTheme } from '@/hooks';
import './SidebarComponent.scss';

export function SidebarComponent() {
  const { collapsed, toggle } = useSidebarToggle();
  const { mode } = useAppTheme();
  const location = useLocation();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const [prevPathname, setPrevPathname] = useState(location.pathname);

  if (location.pathname !== prevPathname) {
    setPrevPathname(location.pathname);
    startTransition(() => {
      setOpenGroup(null);
    });
  }

  const isCustomersActive = location.pathname.startsWith('/customers');

  const handleToggleGroup = (groupName: string) => {
    if (collapsed) {
      toggle();
    }
    setOpenGroup(openGroup === groupName ? null : groupName);
  };

  const handleNavClick = () => {
    setOpenGroup(null);
    if (!collapsed) {
      toggle();
    }
  };

  return (
    <>
      {!collapsed && <div className="sidebar-mobile-backdrop" onClick={toggle} />}

      {collapsed && (
        <IconButton
          onClick={toggle}
          size="small"
          className="mobile-float-toggle"
          aria-label="Abrir Menu"
        >
          <img src={mode === 'dark' ? LogoLightPNG : LogoDarkPNG} alt="Logo" />
          <ChevronRightIcon fontSize="small" />
        </IconButton>
      )}

      <aside className={`app-sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-brand">
          <Link to="/" className="brand-wrapper" onClick={handleNavClick}>
            <img
              src={mode === 'dark' ? LogoLightPNG : LogoDarkPNG}
              alt="Logo"
              className="brand-logo"
            />
            {!collapsed && <span className="brand-title">{import.meta.env.VITE_APP_TITLE}</span>}
          </Link>
        </div>

        <Tooltip title={collapsed ? 'Expandir Menu' : 'Recolher Menu'}>
          <IconButton
            onClick={toggle}
            size="small"
            className="edge-toggle-btn"
            aria-label="Toggle Sidebar"
          >
            {collapsed ? (
              <ChevronRightIcon fontSize="small" />
            ) : (
              <ChevronLeftIcon fontSize="small" />
            )}
          </IconButton>
        </Tooltip>

        <nav className="sidebar-nav">
          <Tooltip title={collapsed ? 'Dashboard' : ''} placement="right" arrow>
            <Link
              to="/"
              className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <DashboardIcon className="nav-icon" />
              {!collapsed && <span>Dashboard</span>}
            </Link>
          </Tooltip>

          <div className="nav-group">
            <Tooltip title={collapsed ? 'Clientes' : ''} placement="right" arrow>
              <div
                className={`nav-item ${isCustomersActive ? 'active' : ''}`}
                onClick={() => handleToggleGroup('customers')}
                style={{ cursor: 'pointer' }}
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
              </div>
            </Tooltip>

            {!collapsed && (
              <Collapse in={openGroup === 'customers'} timeout="auto" unmountOnExit>
                <div className="submenu">
                  <Link
                    to="/customers"
                    className={`sub-nav-item ${location.pathname === '/customers' ? 'active' : ''}`}
                    onClick={handleNavClick}
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
            <FooterComponent />
          </div>
        )}
      </aside>
    </>
  );
}
