import {
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  SearchIcon,
} from '@/components/common/mui';
import type { ReactNode } from 'react';
import './CustomCardComponent.scss';

export interface CustomCardComponentProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  footerInfo?: ReactNode;
  headerAction?: ReactNode;
  children: ReactNode;
}

export function CustomCardComponent({
  title,
  subtitle,
  icon,
  searchPlaceholder = 'Buscar...',
  searchValue = '',
  onSearchChange,
  footerInfo,
  headerAction,
  children,
}: CustomCardComponentProps) {
  return (
    <Card className="custom-card">
      <CardContent>
        <section className="custom-card-container">
          <div className="custom-card-header">
            <div className="custom-card-heading">
              <div className="card-title-wrapper">
                {icon && <span className="card-title-icon">{icon}</span>}

                <Typography variant="h6" component="h2" className="card-title">
                  {title}
                </Typography>
              </div>

              {subtitle && (
                <Typography variant="body2" className="card-subtitle">
                  {subtitle}
                </Typography>
              )}
            </div>

            <div className="custom-card-actions">
              {onSearchChange && (
                <TextField
                  className="card-search-input"
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={onSearchChange}
                  size="small"
                  aria-label={searchPlaceholder}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
              )}

              {headerAction}
            </div>
          </div>

          <div className="custom-card-body">{children}</div>

          {footerInfo && (
            <div className="custom-card-footer">
              <div className="card-footer-info">
                <span className="info-badge">i</span>

                {typeof footerInfo === 'string' ? (
                  <Typography variant="body2">{footerInfo}</Typography>
                ) : (
                  footerInfo
                )}
              </div>
            </div>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
