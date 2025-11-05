import { useEffect, useRef, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

export type Point = { x: number; y: number };

export interface JourneyLineProps {
  points: Point[];
  strokeWidth?: number;
  roughness?: number;
}

/**
 * JourneyLine - A curved, dashed sketchy line connecting multiple points
 * Perfect for timeline visualizations and connecting journey milestones
 *
 * @param points - Array of {x, y} coordinates to connect
 * @param strokeWidth - Line thickness (default: 2)
 * @param roughness - RoughJS roughness parameter (default: 2.5)
 */
export const JourneyLine: React.FC<JourneyLineProps> = ({
  points,
  strokeWidth = 2,
  roughness = 2.5,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useFeebyTheme();

  useEffect(() => {
    if (svgRef.current && points.length > 1) {
      const rc = rough.svg(svgRef.current);
      const strokeColor = theme === 'dark' ? 'white' : 'black';

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      let path = `M ${points[0].x} ${points[0].y}`;

      for (let i = 1; i < points.length; i++) {
        const start = points[i - 1];
        const end = points[i];

        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const direction = i % 2 === 0 ? 1 : -1;

        // Constrain the first segment to prevent it from looping too high
        const verticalRandomness =
          i === 1 ? Math.random() * 100 + 50 : (Math.random() - 0.5) * 200;

        const ctrlX1 =
          start.x + dx * 0.25 + direction * (Math.random() * 200 + 150);
        const ctrlY1 = start.y + dy * 0.5 + verticalRandomness;

        const ctrlX2 =
          end.x - dx * 0.25 - direction * (Math.random() * 200 + 150);
        const ctrlY2 = end.y - dy * 0.5 - verticalRandomness;

        path += ` C ${ctrlX1},${ctrlY1} ${ctrlX2},${ctrlY2} ${end.x},${end.y}`;
      }

      const line = rc.path(path, {
        stroke: strokeColor,
        strokeWidth,
        roughness,
        strokeLineDash: [10, 8],
      });

      svgRef.current.appendChild(line);
    }
  }, [points, theme, strokeWidth, roughness]);

  const svgStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  };

  return (
    <svg
      ref={svgRef}
      style={svgStyle}
    />
  );
};
