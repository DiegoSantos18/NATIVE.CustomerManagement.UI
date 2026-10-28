export interface RouteMeta {
  title: string;
  breadcrumbLabel: string;
}

export const ROUTE_CONFIG: Record<string, RouteMeta> = {
  '/': {
    title: `${import.meta.env.VITE_APP_TITLE_1} | Gestão de Clientes`,
    breadcrumbLabel: 'Dashboard',
  },
  '/cities': {
    title: `${import.meta.env.VITE_APP_TITLE_1} | Clientes por Cidade`,
    breadcrumbLabel: 'Cidades',
  },
  '/customers': {
    title: `${import.meta.env.VITE_APP_TITLE_1} | Detalhes do Cliente`,
    breadcrumbLabel: 'Clientes',
  },
};
