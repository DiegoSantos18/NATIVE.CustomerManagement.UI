import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  GroupIcon,
  EditDocumentIcon,
  NavigateNextIcon,
  Breadcrumbs,
} from '@/components/common';
import { ROUTE_CONFIG } from '@/routes/routeConfig';
import './BreadcrumbComponent.scss';

export function BreadcrumbComponent() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter(Boolean);

  const getIcon = (segment: string) => {
    if (!segment) return <HomeIcon fontSize="small" />;
    if (!isNaN(Number(segment))) return <EditDocumentIcon fontSize="small" />;
    return <GroupIcon fontSize="small" />;
  };

  const items = [{ label: 'Home', path: '/', icon: <HomeIcon fontSize="small" /> }];

  let accumulated = '';
  pathnames.forEach((segment) => {
    const parentPath = accumulated;
    accumulated += `/${segment}`;
    const isId = !isNaN(Number(segment));

    const label = isId
      ? `Editar ${(() => {
          const parentLabel = ROUTE_CONFIG[parentPath]?.breadcrumbLabel || 'Cliente';
          return parentLabel.endsWith('s') ? parentLabel.slice(0, -1) : parentLabel;
        })()}`
      : ROUTE_CONFIG[accumulated]?.breadcrumbLabel || decodeURIComponent(segment);

    const last = items[items.length - 1];
    if (last && last.label.toLowerCase() === label.toLowerCase()) return;

    items.push({ label, path: accumulated, icon: getIcon(segment) });
  });

  return (
    <nav className="app-breadcrumb">
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {items.length > 1 &&
          items.map((item, index) => {
            const isLast = index === items.length - 1;

            return !isLast ? (
              <Link key={item.path} to={item.path} className="breadcrumb-link">
                <span className="breadcrumb-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ) : (
              <span key={item.path} className="breadcrumb-current">
                <span className="breadcrumb-icon">{item.icon}</span>
                <span>{item.label}</span>
              </span>
            );
          })}
      </Breadcrumbs>
    </nav>
  );
}
