import { useEffect, useState, useTransition } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BreadcrumbComponent } from '@/components/common/breadcrumb/BreadcrumbComponent';
import { SidebarComponent } from '@/components/common/sidebar/SidebarComponent';
import { HeaderComponent } from '@/components/common/header/HeaderComponent';
import { FooterComponent } from '@/components/common/footer/FooterComponent';
import { ScrollToTopButton } from '@/components/common/scroll-to-top-button/ScrollToTopButton';
import { useSidebarToggle } from '@/hooks';
import './MainLayout.scss';

export function MainLayout() {
  const location = useLocation();
  const { collapsed } = useSidebarToggle();

  const [isPending, startTransition] = useTransition();
  const [displayLocation, setDisplayLocation] = useState(location);

  useEffect(() => {
    if (location !== displayLocation) {
      startTransition(() => {
        setDisplayLocation(location);
      });
    }
  }, [location, displayLocation, startTransition]);

  return (
    <div className={`main-layout ${collapsed ? 'sidebar-collapsed' : 'sidebar-expanded'}`}>
      <SidebarComponent />

      <div className="layout-content">
        <HeaderComponent />

        <div className="layout-breadcrumb-container">
          <BreadcrumbComponent />
        </div>

        <main className={`page-content ${isPending ? 'fade-transition' : ''}`}>
          <Outlet />
        </main>

        <FooterComponent variant="layout" />

        <ScrollToTopButton />
      </div>
    </div>
  );
}
