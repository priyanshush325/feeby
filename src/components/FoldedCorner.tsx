import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';
import { useFeebyTheme } from '../context/ThemeContext';

type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface FoldedCornerProps {
  corner: Corner;
  size?: number;
  baseColor: string;
  className?: string;
  isBouncy?: boolean;
}

/**
 * FoldedCorner - Creates a folded paper corner effect
 * Used to add realistic paper-like details to components
 *
 * @param corner - Which corner to fold
 * @param size - Size of the fold in pixels (default: 30)
 * @param baseColor - Base color of the paper
 * @param className - Additional CSS classes
 * @param isBouncy - Animates the fold
 */
export const FoldedCorner: React.FC<FoldedCornerProps> = ({
  corner,
  size = 30,
  baseColor,
  className = '',
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
      const strokeColor = 'black';

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const s = size;
      let creasePath;

      switch (corner) {
        case 'topLeft':
          creasePath = `M ${s},0 L 0,${s}`;
          break;
        case 'topRight':
          creasePath = `M 0,0 L ${s},${s}`;
          break;
        case 'bottomLeft':
          creasePath = `M 0,0 L ${s},${s}`;
          break;
        case 'bottomRight':
          creasePath = `M 0,${s} L ${s},0`;
          break;
      }

      const creaseLine = rc.path(creasePath, {
        stroke: strokeColor,
        strokeWidth: 1.5,
        roughness: 2.8,
      });

      svgRef.current.appendChild(creaseLine);
    }
  }, [corner, size, theme, baseColor, seed]);

  const getPositionStyle = (): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      width: size,
      height: size,
    };

    switch (corner) {
      case 'topLeft':
        return { ...base, top: 0, left: 0 };
      case 'topRight':
        return { ...base, top: 0, right: 0 };
      case 'bottomLeft':
        return { ...base, bottom: 0, left: 0 };
      case 'bottomRight':
        return { ...base, bottom: 0, right: 0 };
    }
  };

  return (
    <div className={className} style={getPositionStyle()}>
      <svg ref={svgRef} width={size} height={size} />
    </div>
  );
};
