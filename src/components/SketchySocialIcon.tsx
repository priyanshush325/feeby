import { ElementType, useState, useEffect, useRef, useId, CSSProperties } from 'react';
import rough from 'roughjs/bin/rough';

export interface SketchySocialIconProps {
  icon: ElementType;
  href: string;
  bgColor: string;
  className?: string;
  isBouncy?: boolean;
  size?: number;
}

/**
 * SketchySocialIcon - Social media icon with sketchy hachure fill background
 * Creates animated hand-drawn icon backgrounds
 *
 * @param icon - Icon component (from lucide-react or similar)
 * @param href - Link URL
 * @param bgColor - Background hachure fill color
 * @param className - Additional CSS classes
 * @param isBouncy - Animates the hachure pattern (default: true)
 * @param size - Icon size in pixels (default: 32)
 */
export const SketchySocialIcon: React.FC<SketchySocialIconProps> = ({
  icon: Icon,
  href,
  bgColor,
  className = '',
  isBouncy = true,
  size = 32,
}) => {
  const [mounted, setMounted] = useState(false);
  const patternRef = useRef<SVGPatternElement>(null);
  const patternId = `pattern-${useId()}`;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const draw = () => {
      if (patternRef.current) {
        const svg = patternRef.current.ownerSVGElement;
        if (svg) {
          const rc = rough.svg(svg);
          while (patternRef.current.firstChild) {
            patternRef.current.removeChild(patternRef.current.firstChild);
          }
          const rect = rc.rectangle(0, 0, 24, 24, {
            fill: bgColor,
            fillStyle: 'hachure',
            stroke: 'none',
            hachureGap: 3.5,
            hachureAngle: Math.floor(Math.random() * 90),
            roughness: 2.5,
          });
          patternRef.current.appendChild(rect);
        }
      }
    };

    draw();

    if (isBouncy) {
      const intervalId = setInterval(draw, 200);
      return () => clearInterval(intervalId);
    }
  }, [mounted, bgColor, isBouncy]);

  const linkStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
    width: size,
    height: size,
  };

  const svgStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    transition: 'transform 150ms ease-in-out',
  };

  if (!mounted) {
    return <div className={className} style={{ width: size, height: size, display: 'inline-block' }} />;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={linkStyle}
      onMouseEnter={(e) => {
        const svg = e.currentTarget.querySelector('svg');
        if (svg) svg.style.transform = 'scale(1.1)';
      }}
      onMouseLeave={(e) => {
        const svg = e.currentTarget.querySelector('svg');
        if (svg) svg.style.transform = 'scale(1)';
      }}
    >
      <svg
        style={svgStyle}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            ref={patternRef}
            id={patternId}
            patternUnits="userSpaceOnUse"
            width="24"
            height="24"
          >
            {/* RoughJS will draw the hachure fill here */}
          </pattern>
        </defs>
        <Icon
          stroke="currentColor"
          strokeWidth={1.5}
          fill={`url(#${patternId})`}
        />
      </svg>
    </a>
  );
};
