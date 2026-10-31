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
} from '@/components/common/mui';
import { FooterComponent } from '@/components/common/footer/FooterComponent';
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

  const handleToggleGroup = () => {
    if (collapsed) {
      toggle();
      setOpenGroup('customers');
      return;
    }

    setOpenGroup((current) => (current === 'customers' ? null : 'customers'));
  };

  const handleNavClick = () => {
    setOpenGroup(null);

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
            onClick={handleNavClick}
            aria-label="Página inicial"
          >
            <img src={logo} alt="" className="brand-logo" />

            {!collapsed && <span className="brand-title">{import.meta.env.VITE_APP_TITLE}</span>}
          </Link>

          <Tooltip title={collapsed ? 'Expandir menu' : 'Recolher menu'}>
            <IconButton
              onClick={toggle}
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
              onClick={handleNavClick}
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
                    onClick={handleNavClick}
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
