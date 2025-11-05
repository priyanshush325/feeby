import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

export interface BulletinBoardProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  isBouncy?: boolean;
}

/**
 * BulletinBoard - A cork board with hanging string and wooden frame
 * Perfect for displaying collections of pinned notes
 *
 * @param children - Content to display on the board
 * @param width - Board width (default: 800)
 * @param height - Board height (default: 600)
 * @param isBouncy - Animates with periodic re-renders (default: true)
 */
export const BulletinBoard: React.FC<BulletinBoardProps> = ({
  children,
  width = 800,
  height = 600,
  isBouncy = true,
}) => {
  const boardRef = useRef<SVGSVGElement>(null);
  const frameRef = useRef<SVGSVGElement>(null);
  const stringRef = useRef<SVGSVGElement>(null);
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

  // Draw cork board
  useEffect(() => {
    if (boardRef.current) {
      const rc = rough.svg(boardRef.current, { options: { seed } });
      const fillColor = theme === 'dark' ? '#5a4a3a' : '#d4a574';

      while (boardRef.current.firstChild) {
        boardRef.current.removeChild(boardRef.current.firstChild);
      }

      const borderRadius = 12;
      const r = borderRadius;
      const x = 0;
      const y = 0;
      const w = width;
      const h = height;

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

      const board = rc.path(path, {
        fill: fillColor,
        fillStyle: 'hachure',
        hachureAngle: 60,
        hachureGap: 8,
        stroke: 'none',
      });

      boardRef.current.appendChild(board);
    }
  }, [width, height, theme, seed]);

  // Draw black frame
  useEffect(() => {
    if (frameRef.current) {
      const rc = rough.svg(frameRef.current, { options: { seed } });
      const strokeColor = theme === 'dark' ? '#e5e5e5' : '#1a1a1a';

      while (frameRef.current.firstChild) {
        frameRef.current.removeChild(frameRef.current.firstChild);
      }

      const frameWidth = 12;
      const borderRadius = 12;
      const r = borderRadius;
      const x = 0;
      const y = 0;
      const w = width;
      const h = height;

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

      const frame = rc.path(path, {
        stroke: strokeColor,
        strokeWidth: frameWidth,
        roughness: 2,
        fill: 'none',
      });

      frameRef.current.appendChild(frame);
    }
  }, [width, height, theme, seed]);

  // Draw hanging string
  useEffect(() => {
    if (stringRef.current) {
      const rc = rough.svg(stringRef.current, { options: { seed } });
      const stringColor = theme === 'dark' ? '#b8a591' : '#8b7355';

      while (stringRef.current.firstChild) {
        stringRef.current.removeChild(stringRef.current.firstChild);
      }

      const centerX = width / 2;
      const pinY = 6;
      const boardTopY = 40;

      // Left string
      const leftString = rc.line(centerX - 3, pinY, centerX - 35, boardTopY, {
        stroke: stringColor,
        strokeWidth: 3,
        roughness: 1.5,
      });

      // Right string
      const rightString = rc.line(centerX + 3, pinY, centerX + 35, boardTopY, {
        stroke: stringColor,
        strokeWidth: 3,
        roughness: 1.5,
      });

      // Thumbtack/pin at top
      const pin = rc.circle(centerX, pinY, 12, {
        fill: theme === 'dark' ? '#9ca3af' : '#6b7280',
        fillStyle: 'solid',
        stroke: theme === 'dark' ? '#6b7280' : '#4b5563',
        strokeWidth: 2,
        roughness: 1.5,
      });

      stringRef.current.appendChild(leftString);
      stringRef.current.appendChild(rightString);
      stringRef.current.appendChild(pin);
    }
  }, [width, theme, seed]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    paddingTop: '0.75rem',
  };

  const stringStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    transform: 'translateY(-34px)',
  };

  const boardContainerStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
  };

  const svgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    width: '100%',
    height: '100%',
    padding: '2rem',
  };

  return (
    <div style={containerStyle}>
      <svg
        ref={stringRef}
        width={width}
        height={80}
        style={stringStyle}
      />

      <div style={boardContainerStyle}>
        <svg
          ref={boardRef}
          width={width}
          height={height}
          style={svgStyle}
        />

        <svg
          ref={frameRef}
          width={width}
          height={height}
          style={svgStyle}
        />

        <div style={contentStyle}>{children}</div>
      </div>
    </div>
  );
};
