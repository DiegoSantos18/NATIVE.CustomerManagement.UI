import type { ReactNode } from 'react';
import { Typography } from '@/components/common/mui';
import './PageHeaderComponent.scss';

interface PageHeaderComponentProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function PageHeaderComponent({ title, subtitle, icon, action }: PageHeaderComponentProps) {
  return (
    <header className="page-header">
      <div className="page-heading">
        <div className="title-wrapper">
          {icon && <span className="header-icon">{icon}</span>}
          <Typography variant="h4" component="h1" className="page-title">
            {title}
          </Typography>
        </div>
        {subtitle && (
          <Typography variant="body2" className="page-subtitle">
            {subtitle}
          </Typography>
        )}
      </div>
      {action}
    </header>
  );
}
