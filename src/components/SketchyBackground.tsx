import { useEffect, useRef, useCallback } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

export interface SketchyBackgroundProps {
  color?: string;
  isBouncy?: boolean;
}

/**
 * SketchyBackground - A hachure-filled background that fills its container
 *
 * @param color - Custom color for the hachure fill
 * @param isBouncy - When true, re-renders periodically for animated effect
 */
export const SketchyBackground: React.FC<SketchyBackgroundProps> = ({
  color,
  isBouncy,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useFeebyTheme();

  const draw = useCallback(() => {
    if (svgRef.current) {
      const { clientWidth, clientHeight } = svgRef.current;
      if (clientWidth === 0 || clientHeight === 0) return;

      const rc = rough.svg(svgRef.current);

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const hachureColor =
        color || (theme === 'dark' ? '#444' : 'rgba(0, 0, 0, 0.1)');

      const rect = rc.rectangle(0, 0, clientWidth, clientHeight, {
        fill: hachureColor,
        fillStyle: 'hachure',
        stroke: 'none',
        hachureGap: 5,
        hachureAngle: 45,
        roughness: 1.8,
      });
      svgRef.current.appendChild(rect);
    }
  }, [theme, color]);

  useEffect(() => {
    const svgElement = svgRef.current;
    if (!svgElement) return;

    const observer = new ResizeObserver(() => {
      draw();
    });
    observer.observe(svgElement);

    let interval: NodeJS.Timeout | null = null;
    if (isBouncy) {
      interval = setInterval(draw, 200);
    }

    return () => {
      observer.disconnect();
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [draw, isBouncy]);

  return (
    <svg
      ref={svgRef}
      style={{ width: '100%', height: '100%' }}
      preserveAspectRatio="none"
    />
  );
};
