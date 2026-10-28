import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout';
import { LoadingComponent } from '@/components/common';
import type { ComponentType } from 'react';

const loadWithDelay = <T extends ComponentType<unknown>>(
  importFn: () => Promise<{ default: T }>,
  delay = 1500
): (() => Promise<{ default: T }>) => {
  return () =>
    Promise.all([importFn(), new Promise((resolve) => setTimeout(resolve, delay))]).then(
      ([moduleExports]) => moduleExports
    );
};

const DashboardPage = lazy(
  loadWithDelay(() => import('@/pages/dashboard').then((m) => ({ default: m.DashboardPage })))
);
const CustomersPage = lazy(
  loadWithDelay(() => import('@/pages/customers').then((m) => ({ default: m.CustomersPage })))
);
const CustomerDetailsPage = lazy(
  loadWithDelay(() => import('@/pages/customers').then((m) => ({ default: m.CustomerDetailsPage })))
);
const NotFoundPage = lazy(
  loadWithDelay(() => import('@/pages/common').then((m) => ({ default: m.NotFoundPage })))
);

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingComponent text="Carregando..." fullScreen />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<Navigate to="/" replace />} />

          <Route path="customers" element={<CustomersPage />} />
          <Route path="customers/:id" element={<CustomerDetailsPage />} />
        </Route>

        <Route path="/404-not-found" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404-not-found" replace />} />
      </Routes>
    </Suspense>
  );
}
