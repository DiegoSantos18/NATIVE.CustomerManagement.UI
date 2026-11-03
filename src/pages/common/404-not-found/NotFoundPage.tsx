import { useNavigate } from 'react-router-dom';
import { NotFoundIllustration } from '@/assets';
import {
  SentimentVeryDissatisfiedIcon,
  Box,
  Button,
  Container,
  Typography,
} from '@/components/common/mui';
import './NotFoundPage.scss';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center',
          py: 8,
        }}
      >
        <Typography variant="h3" sx={{ mb: 2, fontWeight: 700, color: 'var(--text-main)' }}>
          <SentimentVeryDissatisfiedIcon fontSize="large" /> Desculpe, página não encontrada!
        </Typography>

        <Typography variant="body1" sx={{ color: 'var(--text-muted)', mb: 4, maxWidth: 480 }}>
          A página que está procurando não existe ou foi movida. Verifique a URL digitada ou retorne
          à página inicial.
        </Typography>

        <Box
          component="img"
          src={NotFoundIllustration}
          alt="404 not found illustration"
          sx={{
            width: '100%',
            maxWidth: 360,
            height: 'auto',
            my: { xs: 3, sm: 5 },
          }}
        />

        <Button
          size="large"
          variant="contained"
          onClick={() => navigate('/')}
          sx={{
            backgroundColor: 'var(--primary)',
            color: 'var(--bg-primary)',
            fontWeight: 600,
            px: 4,
            py: 1.2,
            '&:hover': {
              opacity: 0.9,
              backgroundColor: 'var(--primary)',
            },
          }}
        >
          Voltar ao Início
        </Button>
      </Box>
    </Container>
  );
}
