import { useParams } from 'react-router-dom';
import { PersonIcon, Box, Typography } from '@/components/common';
import './CustomerDetailsPage.scss';

export function CustomerDetailsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Box className="customer-details-container">
      <div className="page-header">
        <div className="title-wrapper">
          <PersonIcon className="header-icon" />
          <Typography variant="h4" component="h1" className="page-title">
            Detalhes do Cliente #{id}
          </Typography>
        </div>
        <Typography variant="body2" className="page-subtitle">
          Formulário de visualização e alteração de dados do cliente.
        </Typography>
      </div>

      <main className="content">
        <p>TODO: Criar formulário de visualização e edição do cliente</p>
      </main>
    </Box>
  );
}
