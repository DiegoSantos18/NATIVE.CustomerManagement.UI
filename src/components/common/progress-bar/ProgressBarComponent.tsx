import { useEffect, useState, type CSSProperties } from 'react';
import './ProgressBarComponent.scss';

type ProgressBarComponentProps = {
  value: number;
  maxValue: number;
  label?: string;
  duration?: number;
};

export function ProgressBarComponent({
  value,
  maxValue,
  label,
  duration = 1400,
}: ProgressBarComponentProps) {
  const targetProgress = maxValue > 0 ? Math.min(Math.max((value / maxValue) * 100, 0), 100) : 0;

  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setIsAnimated(true);
    });

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const progressStyle = {
    '--progress-target': `${targetProgress}%`,
    '--progress-duration': `${duration}ms`,
  } as CSSProperties;

  return (
    <div className="progress-cell">
      <div
        className={`progress-track${isAnimated ? ' is-animated' : ''}`}
        role="progressbar"
        aria-label={label}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={maxValue}
        style={progressStyle}
      >
        <div className="progress-bar" />

        <span className="progress-value">{value.toLocaleString('pt-BR')}</span>
      </div>
    </div>
  );
}
