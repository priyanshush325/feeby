import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

export interface ThumbTackProps {
  className?: string;
  width?: number;
  height?: number;
  isBouncy?: boolean;
}

/**
 * ThumbTack - A decorative thumb tack/push pin
 * Perfect for pinning notes to bulletin boards
 *
 * @param className - Additional CSS classes
 * @param width - Tack width (default: 40)
 * @param height - Tack height (default: 50)
 * @param isBouncy - Animates the tack
 */
export const ThumbTack: React.FC<ThumbTackProps> = ({
  className = '',
  width = 40,
  height = 50,
  isBouncy = false,
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
      const fillColor = '#ef4444';

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const tackPath =
        'M 8,12 C 10,2, 30,2, 32,12 C 35,20, 30,25, 25,28 L 20,40 L 15,28 C 10,25, 5,20, 8,12 Z';

      const tack = rc.path(tackPath, {
        stroke: strokeColor,
        strokeWidth: 2.5,
        fill: fillColor,
        fillStyle: 'hachure',
        fillWeight: 3,
        hachureGap: 4,
        roughness: 2.8,
      });

      svgRef.current.appendChild(tack);
    }
  }, [width, height, theme, seed]);

  return <svg ref={svgRef} width={width} height={height} className={className} />;
};
