import { useAppTheme } from '@/hooks';
import { LogoDarkPNG, LogoLightPNG } from '@/assets';
import './LoadingComponent.scss';

interface LoadingComponentProps {
  text?: string;
  fullScreen?: boolean;
}

export function LoadingComponent({
  text = 'Carregando...',
  fullScreen = true,
}: LoadingComponentProps) {
  const { mode } = useAppTheme();
  const logo = mode === 'dark' ? LogoLightPNG : LogoDarkPNG;
  const brandText = import.meta.env.VITE_APP_TITLE;

  return (
    <div
      className={`loading-state-container ${fullScreen ? 'is-fullscreen' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="loading-brand">
        <div className="loading-indicator" aria-hidden="true">
          <span className="loading-indicator-ring loading-indicator-ring--outer" />
          <span className="loading-indicator-ring loading-indicator-ring--inner" />
          <span className="loading-logo-surface">
            <img className="loading-logo" src={logo} alt="Logo" />
          </span>
        </div>
        <div className="loading-tagline" aria-label={brandText}>
          <span className="loading-tagline-base" aria-hidden="true">
            {brandText}
          </span>
          <span className="loading-tagline-progress" aria-hidden="true">
            {brandText}
          </span>
        </div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
}
