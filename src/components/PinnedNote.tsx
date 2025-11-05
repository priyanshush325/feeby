import { useEffect, useRef, useState, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';

export interface PinnedNoteProps {
  title: string;
  description?: string;
  color?: string;
  pinColor?: string;
  rotation?: number;
  width?: number;
  height?: number;
  children?: React.ReactNode;
  href?: string;
  icon?: 'cube' | 'microphone' | 'book' | null;
  pinPosition?: 'left' | 'center' | 'right';
  fontFamily?: string;
  LinkComponent?: React.ComponentType<{ href: string; children: React.ReactNode; target?: string; rel?: string }>;
}

/**
 * PinnedNote - A sticky note with a push pin
 * Can include icons and custom content. Optionally linkable.
 *
 * @param title - Note title
 * @param description - Optional description text
 * @param color - Note background color (default: yellow)
 * @param pinColor - Push pin color (default: red)
 * @param rotation - Rotation angle in degrees
 * @param width - Note width (default: 200)
 * @param height - Note height (default: 200)
 * @param children - Optional additional content
 * @param href - Optional link URL
 * @param icon - Optional icon type
 * @param pinPosition - Pin placement (default: 'left')
 * @param fontFamily - Font family for text
 * @param LinkComponent - Custom link component (for Next.js Link, etc.)
 */
export const PinnedNote: React.FC<PinnedNoteProps> = ({
  title,
  description,
  color = '#fef08a',
  pinColor = '#ef4444',
  rotation = 0,
  width = 200,
  height = 200,
  children,
  href,
  icon = null,
  pinPosition = 'left',
  fontFamily = 'inherit',
  LinkComponent = 'a' as any,
}) => {
  const noteRef = useRef<SVGSVGElement>(null);
  const pinRef = useRef<SVGSVGElement>(null);
  const iconRef = useRef<SVGSVGElement>(null);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeed((prevSeed) => prevSeed + 1);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  // Draw the note
  useEffect(() => {
    if (noteRef.current) {
      const rc = rough.svg(noteRef.current, { options: { seed } });

      while (noteRef.current.firstChild) {
        noteRef.current.removeChild(noteRef.current.firstChild);
      }

      const note = rc.rectangle(0, 0, width, height, {
        fill: color,
        fillStyle: 'solid',
        stroke: 'black',
        strokeWidth: 2,
        roughness: 2.8,
      });

      noteRef.current.appendChild(note);
    }
  }, [width, height, color, seed]);

  // Draw the push pin
  useEffect(() => {
    if (pinRef.current) {
      const rc = rough.svg(pinRef.current, { options: { seed } });

      while (pinRef.current.firstChild) {
        pinRef.current.removeChild(pinRef.current.firstChild);
      }

      let pinX = 20;
      if (pinPosition === 'center') {
        pinX = width / 2;
      } else if (pinPosition === 'right') {
        pinX = width - 20;
      }
      const pinY = 20;

      const darkenColor = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const darkenFactor = 0.8;
        return `#${Math.floor(r * darkenFactor).toString(16).padStart(2, '0')}${Math.floor(g * darkenFactor).toString(16).padStart(2, '0')}${Math.floor(b * darkenFactor).toString(16).padStart(2, '0')}`;
      };

      const pinHead = rc.circle(pinX, pinY, 16, {
        fill: pinColor,
        fillStyle: 'solid',
        stroke: darkenColor(pinColor),
        strokeWidth: 1.5,
        roughness: 1.5,
      });

      const pinNeedle = rc.line(pinX, pinY + 8, pinX, pinY + 18, {
        stroke: '#6b7280',
        strokeWidth: 2,
        roughness: 1,
      });

      pinRef.current.appendChild(pinHead);
      pinRef.current.appendChild(pinNeedle);
    }
  }, [seed, pinColor, pinPosition, width]);

  // Draw the icon (cube, microphone, or book)
  useEffect(() => {
    if (iconRef.current && icon) {
      const rc = rough.svg(iconRef.current, { options: { seed } });

      while (iconRef.current.firstChild) {
        iconRef.current.removeChild(iconRef.current.firstChild);
      }

      if (icon === 'cube') {
        const cubeSize = 20;
        const x = 2;
        const y = 2;

        const topFace = rc.polygon([
          [x + cubeSize / 2, y],
          [x + cubeSize, y + cubeSize / 4],
          [x + cubeSize / 2, y + cubeSize / 2],
          [x, y + cubeSize / 4],
        ], {
          fill: '#ffffff',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        const leftFace = rc.polygon([
          [x, y + cubeSize / 4],
          [x + cubeSize / 2, y + cubeSize / 2],
          [x + cubeSize / 2, y + cubeSize],
          [x, y + cubeSize * 3 / 4],
        ], {
          fill: '#ef4444',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        const rightFace = rc.polygon([
          [x + cubeSize / 2, y + cubeSize / 2],
          [x + cubeSize, y + cubeSize / 4],
          [x + cubeSize, y + cubeSize * 3 / 4],
          [x + cubeSize / 2, y + cubeSize],
        ], {
          fill: '#3b82f6',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        iconRef.current.appendChild(topFace);
        iconRef.current.appendChild(leftFace);
        iconRef.current.appendChild(rightFace);
      } else if (icon === 'microphone') {
        const x = 8;
        const y = 2;

        const capsule = rc.rectangle(x + 2, y, 6, 10, {
          fill: '#6b7280',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        const stand = rc.line(x + 5, y + 10, x + 5, y + 16, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        const base = rc.line(x + 1, y + 16, x + 9, y + 16, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        iconRef.current.appendChild(capsule);
        iconRef.current.appendChild(stand);
        iconRef.current.appendChild(base);
      } else if (icon === 'book') {
        const x = 4;
        const y = 2;

        const cover = rc.rectangle(x, y, 14, 16, {
          fill: '#8b5cf6',
          fillStyle: 'solid',
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        const spine = rc.line(x + 2, y, x + 2, y + 16, {
          stroke: 'black',
          strokeWidth: 1.5,
          roughness: 1.5,
        });

        const page1 = rc.line(x + 4, y + 5, x + 12, y + 5, {
          stroke: 'black',
          strokeWidth: 1,
          roughness: 1.5,
        });

        const page2 = rc.line(x + 4, y + 9, x + 12, y + 9, {
          stroke: 'black',
          strokeWidth: 1,
          roughness: 1.5,
        });

        const page3 = rc.line(x + 4, y + 13, x + 12, y + 13, {
          stroke: 'black',
          strokeWidth: 1,
          roughness: 1.5,
        });

        iconRef.current.appendChild(cover);
        iconRef.current.appendChild(spine);
        iconRef.current.appendChild(page1);
        iconRef.current.appendChild(page2);
        iconRef.current.appendChild(page3);
      }
    }
  }, [seed, icon]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    transition: 'transform 0.3s ease',
    transform: `rotate(${rotation}deg)`,
    width: `${width}px`,
    height: `${height}px`,
  };

  const svgStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    filter: 'drop-shadow(0 4px 3px rgb(0 0 0 / 0.07))',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    padding: '1.5rem 1rem',
    paddingTop: '3rem',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    fontFamily,
    color: 'black',
  };

  const headerStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    marginBottom: '0.5rem',
  };

  const titleStyle: CSSProperties = {
    fontSize: '1.125rem',
    fontWeight: 'bold',
  };

  const descStyle: CSSProperties = {
    fontSize: '0.875rem',
    color: 'rgba(0, 0, 0, 0.7)',
    marginBottom: '0.5rem',
  };

  const childrenStyle: CSSProperties = {
    fontSize: '0.875rem',
    flexGrow: 1,
  };

  const content = (
    <>
      <svg
        ref={noteRef}
        width={width}
        height={height}
        style={svgStyle}
      />
      <svg
        ref={pinRef}
        width={width}
        height={40}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <div style={contentStyle}>
        <div style={headerStyle}>
          {icon && (
            <svg
              ref={iconRef}
              width={20}
              height={20}
              style={{ flexShrink: 0 }}
            />
          )}
          <h3 style={titleStyle}>{title}</h3>
        </div>
        {description && <p style={descStyle}>{description}</p>}
        {children && <div style={childrenStyle}>{children}</div>}
      </div>
    </>
  );

  if (href) {
    return (
      <LinkComponent
        href={href}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          style={{ ...containerStyle, cursor: 'pointer' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg) scale(1.05)`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = `rotate(${rotation}deg) scale(1)`;
          }}
        >
          {content}
        </div>
      </LinkComponent>
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
