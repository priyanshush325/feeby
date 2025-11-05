import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';

export interface PaperAirplaneProps {
  width?: number;
  height?: number;
  isBouncy?: boolean;
  direction?: 'left' | 'right';
}

/**
 * PaperAirplane - A decorative paper airplane with loopy dotted trail
 * Perfect for adding whimsical flight paths to your designs
 *
 * @param width - Airplane container width (default: 300)
 * @param height - Airplane container height (default: 120)
 * @param isBouncy - Animates with periodic re-renders (default: true)
 * @param direction - Which way the plane points (default: 'right')
 */
export const PaperAirplane: React.FC<PaperAirplaneProps> = ({
  width = 300,
  height = 120,
  isBouncy = true,
  direction = 'right',
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
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

      const planeX = width - 50;
      const planeY = height / 2 - 5;

      let outline, centerFold, upperWingDetail, lowerWingDetail;

      if (direction === 'left') {
        // Flip plane to point left
        outline = rc.polygon([
          [planeX - 32, planeY],
          [planeX + 28, planeY - 12],
          [planeX + 28, planeY + 12],
        ], {
          fill: 'white',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 2.5,
          roughness: 2,
        });

        centerFold = rc.line(planeX - 32, planeY, planeX + 28, planeY, {
          stroke: 'black',
          strokeWidth: 2,
          roughness: 1.5,
        });

        upperWingDetail = rc.line(planeX - 20, planeY - 10, planeX + 10, planeY - 10, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        lowerWingDetail = rc.line(planeX - 20, planeY + 10, planeX + 10, planeY + 10, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });
      } else {
        // Point right
        outline = rc.polygon([
          [planeX + 32, planeY],
          [planeX - 28, planeY - 12],
          [planeX - 28, planeY + 12],
        ], {
          fill: 'white',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 2.5,
          roughness: 2,
        });

        centerFold = rc.line(planeX + 32, planeY, planeX - 28, planeY, {
          stroke: 'black',
          strokeWidth: 2,
          roughness: 1.5,
        });

        upperWingDetail = rc.line(planeX + 20, planeY - 10, planeX - 10, planeY - 10, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        lowerWingDetail = rc.line(planeX + 20, planeY + 10, planeX - 10, planeY + 10, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });
      }

      // Dotted line trail
      const trailStartX = direction === 'left' ? planeX + 28 : planeX - 28;
      const trailStartY = planeY;
      const trailPath = `M ${trailStartX},${trailStartY}
        Q ${trailStartX + (direction === 'left' ? 50 : -50)},${trailStartY - 25} ${trailStartX + (direction === 'left' ? 90 : -90)},${trailStartY}
        T ${trailStartX + (direction === 'left' ? 170 : -170)},${trailStartY - 15}
        Q ${trailStartX + (direction === 'left' ? 210 : -210)},${trailStartY + 20} ${trailStartX + (direction === 'left' ? 250 : -250)},${trailStartY}`;

      const trail = rc.path(trailPath, {
        stroke: '#6b7280',
        strokeWidth: 2.5,
        roughness: 1.8,
        strokeLineDash: [6, 10],
      });

      svgRef.current.appendChild(trail);
      svgRef.current.appendChild(outline);
      svgRef.current.appendChild(centerFold);
      svgRef.current.appendChild(upperWingDetail);
      svgRef.current.appendChild(lowerWingDetail);
    }
  }, [seed, width, height, direction]);

  const svgStyle: CSSProperties = {
    filter: 'drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))',
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      style={svgStyle}
    />
  );
};
