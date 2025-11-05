import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';

export interface StickyTapeProps {
  text: string;
  width?: number;
  height?: number;
  rotation?: number;
  isBouncy?: boolean;
  color?: string;
  fontFamily?: string;
}

const tapeColors = [
  'rgba(255, 218, 185, 0.8)', // peach
  'rgba(255, 255, 204, 0.8)', // light yellow
  'rgba(221, 160, 221, 0.8)', // plum
  'rgba(173, 216, 230, 0.8)', // light blue
  'rgba(144, 238, 144, 0.8)', // light green
  'rgba(255, 182, 193, 0.8)', // light pink
];

/**
 * StickyTape - A colorful tape label with text
 * Perfect for skill tags or labels on sticky notes
 *
 * @param text - Text to display on the tape
 * @param width - Tape width (default: 100)
 * @param height - Tape height (default: 25)
 * @param rotation - Rotation in degrees (default: 0)
 * @param isBouncy - Animates the tape
 * @param color - Custom tape color (random pastel if not provided)
 * @param fontFamily - Font family for text (default: inherit)
 */
export const StickyTape: React.FC<StickyTapeProps> = ({
  text,
  width = 100,
  height = 25,
  rotation = 0,
  isBouncy = false,
  color,
  fontFamily = 'inherit',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [seed, setSeed] = useState(0);
  const [tapeColor] = useState(
    color || tapeColors[Math.floor(Math.random() * tapeColors.length)]
  );

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

      const rect = rc.rectangle(0, 0, width, height, {
        fill: tapeColor,
        stroke: tapeColor,
        fillStyle: 'hachure',
        roughness: 1.5,
        hachureAngle: 60,
        hachureGap: 3,
      });

      svgRef.current.appendChild(rect);
    }
  }, [width, height, seed, tapeColor]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    transform: `rotate(${rotation}deg)`,
    width: `${width}px`,
    height: `${height}px`,
  };

  const svgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
  };

  const textContainerStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    padding: '0 0.5rem',
  };

  const textStyle: CSSProperties = {
    fontSize: '0.75rem',
    fontFamily,
    color: 'black',
    fontWeight: 600,
  };

  return (
    <div style={containerStyle}>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        style={svgStyle}
      />
      <div style={textContainerStyle}>
        <span style={textStyle}>{text}</span>
      </div>
    </div>
  );
};
