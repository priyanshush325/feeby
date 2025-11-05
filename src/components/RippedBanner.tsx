import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';
import { Tape } from './Tape';

export interface RippedBannerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  color?: string;
  isBouncy?: boolean;
}

/**
 * RippedBanner - A paper banner with jagged torn edges
 * Decorated with tape at the top corners
 *
 * @param children - Content to display on the banner
 * @param width - Banner width in pixels
 * @param height - Banner height in pixels
 * @param color - Background color (default: papery yellow)
 * @param isBouncy - Animates the tape (default: false)
 */
export const RippedBanner: React.FC<RippedBannerProps> = ({
  children,
  width,
  height,
  color = '#fefce8',
  isBouncy = false,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const { theme } = useFeebyTheme();
  const [seed] = useState(Math.random());

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current, { options: { seed } });
      const strokeColor = theme === 'dark' ? '#e5e7eb' : '#1f2937';

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const jaggedness = 8;
      const segmentCount = 6;

      const jaggedLine = (
        x1: number,
        y1: number,
        x2: number,
        y2: number
      ) => {
        let line = '';
        const dx = (x2 - x1) / segmentCount;
        const dy = (y2 - y1) / segmentCount;
        for (let i = 1; i <= segmentCount; i++) {
          const px = x1 + dx * i;
          const py = y1 + dy * i;
          line += `L ${px + (Math.random() - 0.5) * jaggedness} ${
            py + (Math.random() - 0.5) * jaggedness
          } `;
        }
        return line;
      };

      const path = `
        M ${(Math.random() - 0.5) * jaggedness} ${(Math.random() - 0.5) * jaggedness}
        ${jaggedLine(0, 0, width, 0)}
        ${jaggedLine(width, 0, width, height)}
        ${jaggedLine(width, height, 0, height)}
        ${jaggedLine(0, height, 0, 0)}
      `;

      const banner = rc.path(path, {
        stroke: strokeColor,
        strokeWidth: 1.5,
        roughness: 2.5,
        fill: color,
        fillStyle: 'solid',
      });
      svgRef.current.appendChild(banner);
    }
  }, [width, height, color, theme, seed]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
  };

  const svgStyle: CSSProperties = {
    filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
  };

  const tapeTopLeftStyle: CSSProperties = {
    position: 'absolute',
    top: '-0.25rem',
    left: '-0.25rem',
  };

  const tapeTopRightStyle: CSSProperties = {
    position: 'absolute',
    top: '-0.25rem',
    right: '-0.25rem',
  };

  const contentStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    color: 'black',
  };

  return (
    <div style={containerStyle}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={svgStyle}
      />
      <div style={tapeTopLeftStyle}>
        <Tape width={30} height={15} rotation={-25} isBouncy={isBouncy} />
      </div>
      <div style={tapeTopRightStyle}>
        <Tape width={30} height={15} rotation={25} isBouncy={isBouncy} />
      </div>
      <div style={contentStyle}>
        {children}
      </div>
    </div>
  );
};
