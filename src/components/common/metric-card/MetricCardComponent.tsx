import type { ReactNode } from 'react';
import {
  TrendingUpIcon,
  TrendingDownIcon,
  Card,
  CardContent,
  Typography,
} from '@/components/common/mui';
import { CountUpComponent } from '@/components/common/count-up/CountUpComponent';
import './MetricCardComponent.scss';

interface MetricCardProps {
  label: string;
  value: number;
  loading: boolean;
  footerText?: string;
  footerContent?: ReactNode;
  trend?: 'up' | 'down';
  illustrationIcon: ReactNode;
}

export function MetricCardComponent({
  label,
  value,
  loading,
  footerText,
  footerContent,
  trend = 'up',
  illustrationIcon,
}: MetricCardProps) {
  return (
    <Card className="metric-card">
      <CardContent>
        <div className="metric-content">
          <Typography className="metric-label">{label}</Typography>

          <Typography variant="h4" component="p" className="metric-value">
            {loading ? '—' : <CountUpComponent value={value} />}
          </Typography>

          <div className={`metric-footer trend-${trend}`}>
            {trend === 'down' ? (
              <TrendingDownIcon className="trend-icon" />
            ) : (
              <TrendingUpIcon className="trend-icon" />
            )}
            <span>{footerContent || footerText}</span>
          </div>
        </div>

        {illustrationIcon}
      </CardContent>
    </Card>
  );
}
