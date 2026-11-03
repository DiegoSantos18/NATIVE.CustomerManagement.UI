import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  duration?: number;
}

export function CountUpComponent({ value, duration = 1800 }: CountUpProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion || value <= 0) {
          setCount(value);
          return;
        }

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
          if (startTime === null) {
            startTime = timestamp;
          }

          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easedProgress = 1 - Math.pow(1 - progress, 3);

          setCount(Math.floor(easedProgress * value));

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            setCount(value);
            animationFrameRef.current = null;
          }
        };

        animationFrameRef.current = requestAnimationFrame(animate);
      },
      { threshold: 0.3 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, duration]);

  return <span ref={elementRef}>{count.toLocaleString('pt-BR')}</span>;
}
