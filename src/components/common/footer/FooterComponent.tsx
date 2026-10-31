import { LinkedInIcon } from '@/components/common/mui';
import { LogoDarkPNG, LogoLightPNG } from '@/assets';
import { useAppTheme } from '@/hooks';
import './FooterComponent.scss';

interface FooterComponentProps {
  variant?: 'layout' | 'sidebar';
}

export function FooterComponent({ variant = 'layout' }: FooterComponentProps) {
  const currentYear = new Date().getFullYear();
  const { mode } = useAppTheme();

  return (
    <footer className={`app-footer footer-${variant}`}>
      <div className="footer-content">
        <div className="footer-copyright">© {currentYear}</div>
        <div className="footer-brands">
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-brand footer-link"
          >
            <LinkedInIcon className="brand-logo" fontSize="small" />
            Diego dos Santos
          </a>
          <span className="separator">&amp;</span>
          <a
            href="https://nativeip.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-brand footer-link"
          >
            <img
              src={mode === 'dark' ? LogoLightPNG : LogoDarkPNG}
              alt="Logo"
              className="brand-logo"
            />
            {import.meta.env.VITE_APP_TITLE_1}
          </a>
        </div>
      </div>
    </footer>
  );
}
