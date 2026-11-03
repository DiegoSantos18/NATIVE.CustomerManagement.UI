interface RouteMeta {
  title: string;
  breadcrumbLabel: string;
}

const fullAppName = import.meta.env.VITE_APP_NAME;
const appName = import.meta.env.VITE_APP_SHORT_NAME;

export const ROUTE_CONFIG: Record<string, RouteMeta> = {
  '/': {
    title: `${fullAppName}`,
    breadcrumbLabel: 'Dashboard',
  },
  '/cities': {
    title: `${appName} | Clientes por Cidade`,
    breadcrumbLabel: 'Cidades',
  },
  '/customers': {
    title: `${appName} | Clientes`,
    breadcrumbLabel: 'Clientes',
  },
};

export function getRouteTitle(pathname: string): string {
  const customerDetailsMatch = pathname.match(/^\/customers\/([^/]+)$/);
  if (customerDetailsMatch) {
    return `${appName} | Editar Cliente #${decodeURIComponent(customerDetailsMatch[1])}`;
  }

  return ROUTE_CONFIG[pathname]?.title ?? `${appName} | Página não encontrada`;
}
