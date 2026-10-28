import { PeopleIcon, Box, Typography } from '@/components/common';
import './CustomersPage.scss';

export function CustomersPage() {
  return (
    <Box className="customers-container">
      <div className="page-header">
        <div className="title-wrapper">
          <PeopleIcon className="header-icon" />
          <Typography variant="h4" component="h1" className="page-title">
            Listagem de Clientes
          </Typography>
        </div>
        <Typography variant="body2" className="page-subtitle">
          Gerenciamento e listagem completa dos clientes cadastrados.
        </Typography>
      </div>

      <main className="content">
        <p>TODO: Criar listagem de clientes</p>
      </main>
    </Box>
  );
}
