import { useState, useEffect, useRef, CSSProperties } from 'react';
import { useFeebyTheme } from '../context/ThemeContext';
import rough from 'roughjs/bin/rough';
import { FoldedCorner } from './FoldedCorner';
import { StickyTape } from './StickyTape';

export interface StickyNoteProps {
  title: string;
  company: string;
  date: string;
  children: React.ReactNode;
  color?: string;
  className?: string;
  rotation?: number;
  foldedCorner?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'none';
  foldSize?: number;
  isBouncy?: boolean;
  width?: number;
  height?: number;
  anchorRef?: React.Ref<HTMLDivElement>;
  logoComponent?: React.ReactNode;
  skills?: string[];
  fontFamily?: string;
}

/**
 * StickyNote - A feature-rich sticky note component
 * Perfect for displaying experience cards, project cards, etc.
 *
 * @param title - Note title
 * @param company - Company or organization name
 * @param date - Date range or timestamp
 * @param children - Main content
 * @param color - Note color (default: yellow)
 * @param className - Additional CSS classes
 * @param rotation - Rotation in degrees (default: -2)
 * @param foldedCorner - Which corner to fold (default: 'none')
 * @param foldSize - Size of the fold
 * @param isBouncy - Animates the note
 * @param width - Note width (default: 256)
 * @param height - Note height (default: 256)
 * @param anchorRef - Ref for positioning anchors
 * @param logoComponent - Optional logo to display
 * @param skills - Array of skill tags to show as sticky tapes
 * @param fontFamily - Font family for text
 */
export const StickyNote: React.FC<StickyNoteProps> = ({
  title,
  company,
  date,
  children,
  color = '#ffec99',
  className = '',
  rotation = -2,
  foldedCorner = 'none',
  foldSize,
  isBouncy = false,
  width = 256,
  height = 256,
  anchorRef,
  logoComponent,
  skills = [],
  fontFamily = 'inherit',
}) => {
  const [actualFoldSize, setActualFoldSize] = useState(30);
  const svgRef = useRef<SVGSVGElement>(null);
  const logoCircleRef = useRef<SVGSVGElement>(null);
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
    if (logoCircleRef.current) {
      const rc = rough.svg(logoCircleRef.current, { options: { seed } });
      const strokeColor = 'black';

      while (logoCircleRef.current.firstChild) {
        logoCircleRef.current.removeChild(logoCircleRef.current.firstChild);
      }

      const circle = rc.circle(24, 24, 46, {
        stroke: strokeColor,
        strokeWidth: 1.5,
        roughness: 2.5,
        strokeLineDash: [6, 6],
        fill: 'white',
        fillStyle: 'solid',
      });

      logoCircleRef.current.appendChild(circle);
    }
  }, [seed]);

  useEffect(() => {
    setActualFoldSize(foldSize ?? Math.random() * 20 + 25);
  }, [foldSize]);

  useEffect(() => {
    if (svgRef.current) {
      const rc = rough.svg(svgRef.current, { options: { seed } });
      const strokeColor = 'black';

      while (svgRef.current.firstChild) {
        svgRef.current.removeChild(svgRef.current.firstChild);
      }

      const borderRadius = 15;
      const strokeWidth = 2;

      const r = borderRadius;
      const x = strokeWidth / 2;
      const y = strokeWidth / 2;
      const w = width - strokeWidth;
      const h = height - strokeWidth;
      const s = actualFoldSize;

      let mainPath;

      switch (foldedCorner) {
        case 'topLeft':
          mainPath = `M ${x + s},${y} L ${x + w - r},${y} A ${r},${r} 0 0 1 ${x + w},${y + r} L ${x + w},${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} L ${x + r},${y + h} A ${r},${r} 0 0 1 ${x},${y + h - r} L ${x},${y + s} Z`;
          break;
        case 'topRight':
          mainPath = `M ${x + r},${y} L ${x + w - s},${y} L ${x + w},${y + s} L ${x + w},${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} L ${x + r},${y + h} A ${r},${r} 0 0 1 ${x},${y + h - r} L ${x},${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;
          break;
        case 'bottomLeft':
          mainPath = `M ${x + r},${y} L ${x + w - r},${y} A ${r},${r} 0 0 1 ${x + w},${y + r} L ${x + w},${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} L ${x + s},${y + h} L ${x},${y + h - s} L ${x},${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;
          break;
        case 'bottomRight':
          mainPath = `M ${x + r},${y} L ${x + w - r},${y} A ${r},${r} 0 0 1 ${x + w},${y + r} L ${x + w},${y + h - s} L ${x + w - s},${y + h} L ${x + r},${y + h} A ${r},${r} 0 0 1 ${x},${y + h - r} L ${x},${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;
          break;
        default:
          mainPath = `M ${x + r},${y} L ${x + w - r},${y} A ${r},${r} 0 0 1 ${x + w},${y + r} L ${x + w},${y + h - r} A ${r},${r} 0 0 1 ${x + w - r},${y + h} L ${x + r},${y + h} A ${r},${r} 0 0 1 ${x},${y + h - r} L ${x},${y + r} A ${r},${r} 0 0 1 ${x + r},${y} Z`;
      }

      const mainShape = rc.path(mainPath, {
        stroke: strokeColor,
        strokeWidth: strokeWidth,
        roughness: 2.8,
        fill: color,
        fillStyle: 'solid',
      });
      svgRef.current.appendChild(mainShape);

      let foldTrianglePath;
      switch (foldedCorner) {
        case 'topLeft':
          foldTrianglePath = `M ${x},${y + s} L ${x + s},${y + s} L ${x + s},${y}`;
          break;
        case 'topRight':
          foldTrianglePath = `M ${x + w - s},${y} L ${x + w - s},${y + s} L ${x + w},${y + s}`;
          break;
        case 'bottomLeft':
          foldTrianglePath = `M ${x},${y + h - s} L ${x + s},${y + h - s} L ${x + s},${y + h}`;
          break;
        case 'bottomRight':
          foldTrianglePath = `M ${x + w},${y + h - s} L ${x + w - s},${y + h - s} L ${x + w - s},${y + h}`;
          break;
      }

      if (foldTrianglePath) {
        const foldTriangle = rc.path(foldTrianglePath, {
          stroke: strokeColor,
          strokeWidth: 1.5,
          roughness: 2.8,
        });
        svgRef.current.appendChild(foldTriangle);
      }
    }
  }, [color, theme, foldedCorner, actualFoldSize, seed, width, height]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    transform: `rotate(${rotation}deg)`,
    width: `${width}px`,
    height: `${height}px`,
    transition: 'transform 0.3s ease',
  };

  const svgStyle: CSSProperties = {
    filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))',
  };

  const shadowStyle: CSSProperties = {
    position: 'absolute',
    top: '6px',
    left: '6px',
    right: '6px',
    height: '2rem',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderTopLeftRadius: '15px',
    borderTopRightRadius: '15px',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily,
    color: 'black',
    padding: width < 300 ? '1rem' : '1.5rem',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: width < 300 ? '0.5rem' : '1rem',
  };

  const logoStyle: CSSProperties = {
    position: 'relative',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: width < 300 ? '2rem' : '3rem',
    height: width < 300 ? '2rem' : '3rem',
  };

  const logoCircleStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
  };

  const textContainerStyle: CSSProperties = {
    flexGrow: 1,
  };

  const titleStyle: CSSProperties = {
    fontSize: width < 300 ? '1rem' : '1.25rem',
  };

  const companyContainerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const companyStyle: CSSProperties = {
    fontWeight: 'bold',
    fontSize: width < 300 ? '1rem' : '1.25rem',
  };

  const anchorStyle: CSSProperties = {
    position: 'absolute',
    top: '50%',
    right: '-1rem',
    transform: 'translateY(-50%)',
    width: '1px',
    height: '1px',
  };

  const dateStyle: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.7)',
    fontSize: width < 300 ? '0.75rem' : '0.875rem',
  };

  const childrenContainerStyle: CSSProperties = {
    color: 'rgba(0, 0, 0, 0.8)',
    marginTop: width < 300 ? '0.5rem' : '1rem',
    fontSize: width < 300 ? '0.875rem' : '1rem',
  };

  const skillsContainerStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: width < 300 ? '0.5rem' : '1rem',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem',
    justifyContent: 'center',
    padding: `0 ${width < 300 ? '1rem' : '1.5rem'}`,
  };

  return (
    <div
      className={`${className}`}
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
      }}
    >
      <div style={{ position: 'absolute', inset: 0 }}>
        <svg ref={svgRef} width={width} height={height} style={svgStyle} />
        <div style={shadowStyle} />
      </div>
      {foldedCorner !== 'none' && (
        <FoldedCorner
          corner={foldedCorner}
          size={actualFoldSize}
          baseColor={color}
          isBouncy={isBouncy}
        />
      )}
      <div style={contentStyle}>
        <div style={headerStyle}>
          {logoComponent && (
            <div style={logoStyle}>
              <svg
                ref={logoCircleRef}
                style={logoCircleStyle}
                viewBox="0 0 48 48"
              />
              <div style={{ position: 'relative', zIndex: 10 }}>{logoComponent}</div>
            </div>
          )}
          <div style={textContainerStyle}>
            <h3 style={titleStyle}>{title}</h3>
            <div style={companyContainerStyle}>
              <p style={companyStyle}>{company}</p>
              <div ref={anchorRef} style={anchorStyle} />
            </div>
            <p style={dateStyle}>{date}</p>
          </div>
        </div>
        <div style={childrenContainerStyle}>{children}</div>
        {skills.length > 0 && (
          <div style={skillsContainerStyle}>
            {skills.map((skill, index) => (
              <StickyTape
                key={index}
                text={skill}
                width={width < 300 ? skill.length * 6 + 16 : skill.length * 8 + 20}
                height={width < 300 ? 18 : 22}
                rotation={Math.random() * 6 - 3}
                isBouncy={isBouncy}
                fontFamily={fontFamily}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
