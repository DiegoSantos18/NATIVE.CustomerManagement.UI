import {
  DashboardIcon,
  BadgeIcon,
  LocationOnIcon,
  Box,
  Typography,
  Card,
  CardContent,
} from '@/components/common';
import './DashboardPage.scss';

export function DashboardPage() {
  return (
    <Box className="dashboard-container">
      <div className="dashboard-header">
        <div className="title-wrapper">
          <DashboardIcon className="header-icon" />
          <Typography variant="h4" component="h1" className="page-title">
            Dashboard
          </Typography>
        </div>
        <Typography variant="body2" className="page-subtitle">
          Bem-vindo ao painel de gestão e controle da plataforma.
        </Typography>
      </div>

      <div className="dashboard-grid">
        <Card className="metric-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="overline">
              <BadgeIcon fontSize="small" /> Laura Richards
            </Typography>
            <Typography variant="h5" component="div" className="metric-value">
              <LocationOnIcon fontSize="small" /> Warner, NH
            </Typography>
          </CardContent>
        </Card>

        <Card className="metric-card">
          <CardContent>
            <Typography color="textSecondary" gutterBottom variant="overline">
              <BadgeIcon fontSize="small" /> Margaret Mendoza
            </Typography>
            <Typography variant="h5" component="div" className="metric-value">
              <LocationOnIcon fontSize="small" /> East Natchitoches, PA
            </Typography>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
}
