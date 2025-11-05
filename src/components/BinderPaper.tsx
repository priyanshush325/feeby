import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';

export interface BinderPaperProps {
  title: string;
  date?: string;
  excerpt?: string;
  href?: string;
  width?: number;
  height?: number;
  rotation?: number;
  isBouncy?: boolean;
  fontFamily?: string;
  LinkComponent?: React.ComponentType<{
    href: string;
    children: React.ReactNode;
    target?: string;
    rel?: string;
  }>;
}

/**
 * BinderPaper - Ruled notebook paper with red margin line and binder holes
 * Perfect for displaying blog posts, notes, or articles
 *
 * @param title - Paper title/heading
 * @param date - Optional date text
 * @param excerpt - Optional description/excerpt
 * @param href - Optional link URL
 * @param width - Paper width (default: 280)
 * @param height - Paper height (default: 320)
 * @param rotation - Rotation in degrees (default: 0)
 * @param isBouncy - Animates the paper (default: true)
 * @param fontFamily - Font family for text
 * @param LinkComponent - Custom link component (for Next.js Link, etc.)
 */
export const BinderPaper: React.FC<BinderPaperProps> = ({
  title,
  date,
  excerpt,
  href,
  width = 280,
  height = 320,
  rotation = 0,
  isBouncy = true,
  fontFamily = 'inherit',
  LinkComponent,
}) => {
  const paperRef = useRef<SVGSVGElement>(null);
  const tapeRef = useRef<SVGSVGElement>(null);
  const holesRef = useRef<SVGSVGElement>(null);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    if (isBouncy) {
      const interval = setInterval(() => {
        setSeed((prevSeed) => prevSeed + 1);
      }, 150);
      return () => clearInterval(interval);
    }
  }, [isBouncy]);

  // Draw the paper
  useEffect(() => {
    if (paperRef.current) {
      const rc = rough.svg(paperRef.current, { options: { seed } });

      while (paperRef.current.firstChild) {
        paperRef.current.removeChild(paperRef.current.firstChild);
      }

      // Paper background
      const paper = rc.rectangle(0, 0, width, height, {
        fill: 'white',
        fillStyle: 'solid',
        stroke: 'black',
        strokeWidth: 2,
        roughness: 1.5,
      });

      // Horizontal lines (ruled paper)
      const lineSpacing = 25;
      const startY = 60;
      for (let i = 0; i < 8; i++) {
        const y = startY + i * lineSpacing;
        const line = rc.line(30, y, width - 30, y, {
          stroke: '#cbd5e1',
          strokeWidth: 1,
          roughness: 0.5,
        });
        paperRef.current.appendChild(line);
      }

      // Red margin line
      const marginLine = rc.line(30, 20, 30, height - 20, {
        stroke: '#ef4444',
        strokeWidth: 2,
        roughness: 1,
      });

      paperRef.current.appendChild(paper);
      paperRef.current.appendChild(marginLine);
    }
  }, [width, height, seed]);

  // Draw binder holes
  useEffect(() => {
    if (holesRef.current) {
      const rc = rough.svg(holesRef.current, { options: { seed } });

      while (holesRef.current.firstChild) {
        holesRef.current.removeChild(holesRef.current.firstChild);
      }

      // Three holes along the left edge
      const holePositions = [height * 0.25, height * 0.5, height * 0.75];

      holePositions.forEach((y) => {
        const hole = rc.circle(15, y, 12, {
          fill: 'transparent',
          stroke: 'black',
          strokeWidth: 2,
          roughness: 1.5,
        });
        holesRef.current?.appendChild(hole);
      });
    }
  }, [height, seed]);

  // Draw tape
  useEffect(() => {
    if (tapeRef.current) {
      const rc = rough.svg(tapeRef.current, { options: { seed } });

      while (tapeRef.current.firstChild) {
        tapeRef.current.removeChild(tapeRef.current.firstChild);
      }

      // Tape at top
      const tapeWidth = 80;
      const tapeHeight = 20;
      const tapeX = (width - tapeWidth) / 2;

      const tape = rc.rectangle(tapeX, -5, tapeWidth, tapeHeight, {
        fill: 'rgba(255, 235, 153, 0.7)',
        fillStyle: 'hachure',
        hachureGap: 3,
        stroke: 'rgba(0, 0, 0, 0.3)',
        strokeWidth: 1,
        roughness: 1.5,
      });

      tapeRef.current.appendChild(tape);
    }
  }, [width, seed]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    transform: `rotate(${rotation}deg)`,
    width: `${width}px`,
    height: `${height}px`,
    transition: 'transform 0.3s ease',
  };

  const tapeSvgStyle: CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
  };

  const paperSvgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
  };

  const holesSvgStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    top: 0,
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '1.5rem',
    paddingLeft: '3rem',
    paddingTop: '2rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily,
  };

  const titleStyle: CSSProperties = {
    fontSize: width < 300 ? '1.25rem' : '1.5rem',
    fontWeight: 'bold',
    color: 'black',
    marginBottom: '0.5rem',
  };

  const dateStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: 'rgba(0, 0, 0, 0.6)',
    marginBottom: '0.75rem',
  };

  const excerptStyle: CSSProperties = {
    fontSize: width < 300 ? '0.875rem' : '1rem',
    color: 'rgba(0, 0, 0, 0.8)',
  };

  const content = (
    <>
      <svg
        ref={tapeRef}
        width={width}
        height={40}
        style={tapeSvgStyle}
      />

      <svg
        ref={paperRef}
        width={width}
        height={height}
        style={paperSvgStyle}
      />

      <svg
        ref={holesRef}
        width={30}
        height={height}
        style={holesSvgStyle}
      />

      <div style={contentStyle}>
        <h3 style={titleStyle}>{title}</h3>
        {date && <p style={dateStyle}>{date}</p>}
        {excerpt && <p style={excerptStyle}>{excerpt}</p>}
      </div>
    </>
  );

  if (href) {
    if (LinkComponent) {
      return (
        <LinkComponent href={href} target="_blank" rel="noopener noreferrer">
          <div
            style={containerStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1.05)`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
            }}
          >
            {content}
          </div>
        </LinkComponent>
      );
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', cursor: 'pointer' }}
      >
        <div
          style={containerStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1.05)`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
          }}
        >
          {content}
        </div>
      </a>
    );
  }

  return (
    <div
      style={containerStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rotation}deg) scale(1)`;
      }}
    >
      {content}
    </div>
  );
};
