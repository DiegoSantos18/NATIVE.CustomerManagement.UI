import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IconButton, Tooltip, KeyboardArrowUpIcon } from '@/components/common/mui';
import './ScrollToTopButton.scss';

export function ScrollToTopButton() {
  const { pathname } = useLocation();
  const [visible, setVisible] = useState(false);

  // Scroll para o topo automático ao mudar de rota
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [pathname]);

  // Monitoriza o scroll para exibir o botão apenas quando descer a página
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 250) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!visible) return null;

  return (
    <Tooltip title="Voltar ao topo" placement="left">
      <IconButton
        onClick={scrollToTop}
        className="scroll-to-top-btn"
        aria-label="Voltar ao topo"
        size="large"
      >
        <KeyboardArrowUpIcon />
      </IconButton>
    </Tooltip>
  );
}
