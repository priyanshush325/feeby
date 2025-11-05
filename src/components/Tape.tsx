import { useEffect, useRef, useState } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

export interface TapeProps {
  width: number;
  height: number;
  rotation?: number;
  isBouncy?: boolean;
}

/**
 * Tape - A single piece of sketchy tape
 * Creates a hand-drawn tape effect with hachure fill
 *
 * @param width - Tape width in pixels
 * @param height - Tape height in pixels
 * @param rotation - Rotation angle in degrees (default: 0)
 * @param isBouncy - Animates with periodic re-renders (default: false)
 */
export const Tape: React.FC<TapeProps> = ({ width, height, rotation = 0, isBouncy = false }) => {
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

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const points = [
        [0, height * 0.3],
        [width, 0],
        [width * 0.7, height],
        [0, height],
      ];

      const tapeColor =
        theme === 'dark'
          ? 'rgba(255, 255, 204, 0.7)'
          : 'rgba(210, 180, 140, 0.8)';

      const tape = rc.polygon(points as [number, number][], {
        fill: tapeColor,
        stroke: tapeColor,
        roughness: 1.5,
        hachureAngle: 60,
        hachureGap: 3,
        fillStyle: 'hachure',
      });

      svgRef.current.style.transform = `rotate(${rotation}deg)`;
      svgRef.current.appendChild(tape);
    }
  }, [width, height, rotation, theme, seed]);

  return <svg ref={svgRef} width={width} height={height} />;
};
