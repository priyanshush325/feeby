import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

export interface SketchyRectangleProps {
  width: number;
  height: number;
  borderRadius?: number;
  isBouncy?: boolean;
  strokeWidth?: number;
  fill?: string;
}

/**
 * SketchyRectangle - A hand-drawn rectangle with optional rounded corners
 *
 * @param width - Width in pixels
 * @param height - Height in pixels
 * @param borderRadius - Corner radius (default: 0)
 * @param isBouncy - Animates with periodic re-renders (default: false)
 * @param strokeWidth - Border thickness (default: 2)
 * @param fill - Fill color
 */
export const SketchyRectangle: React.FC<SketchyRectangleProps> = ({
  width,
  height,
  borderRadius = 0,
  isBouncy = false,
  strokeWidth: customStrokeWidth,
  fill,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useFeebyTheme();
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (isBouncy) {
      const interval = setInterval(() => {
        setSeed((prevSeed) => prevSeed + 1);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isBouncy]);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current, { options: { seed } });
      const strokeColor = theme === 'dark' ? 'white' : 'black';
      const strokeWidth = customStrokeWidth ?? 2;

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const r = Math.min(borderRadius, width / 2, height / 2);
      const x = strokeWidth / 2;
      const y = strokeWidth / 2;
      const w = width - strokeWidth;
      const h = height - strokeWidth;
      const path = `
          M ${x + r},${y}
          L ${x + w - r},${y}
          A ${r},${r} 0 0 1 ${x + w},${y + r}
          L ${x + w},${y + h - r}
          A ${r},${r} 0 0 1 ${x + w - r},${y + h}
          L ${x + r},${y + h}
          A ${r},${r} 0 0 1 ${x},${y + h - r}
          L ${x},${y + r}
          A ${r},${r} 0 0 1 ${x + r},${y}
          Z
        `;
      const shape = rc.path(path, {
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        roughness: 2,
        fill: fill,
        fillStyle: 'solid',
      });

      svgRef.current.appendChild(shape);
    }
  }, [width, height, borderRadius, theme, seed, customStrokeWidth, fill]);

  return <svg ref={svgRef} width={width} height={height} />;
};
