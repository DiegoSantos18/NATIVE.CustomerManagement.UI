import { useState, useTransition } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  BreadcrumbComponent,
  SidebarComponent,
  HeaderComponent,
  FooterComponent,
} from '@/components/common';
import './MainLayout.scss';

export function MainLayout() {
  const location = useLocation();
  const [isPending, startTransition] = useTransition();
  const [displayLocation, setDisplayLocation] = useState(location);

  if (location !== displayLocation && !isPending) {
    startTransition(() => {
      setDisplayLocation(location);
    });
  }

  return (
    <div className="main-layout">
      <SidebarComponent />
      <div className="layout-content">
        <HeaderComponent />

        <div className="layout-breadcrumb-container">
          <BreadcrumbComponent />
        </div>

        <main className={`page-content ${isPending ? 'fade-transition' : ''}`}>
          <Outlet />
        </main>

        <FooterComponent />
      </div>
    </div>
  );
}
