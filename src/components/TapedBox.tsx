import { useRef, useEffect, useState, CSSProperties } from 'react';
import { useFeebyTheme } from '../context/ThemeContext';
import { SketchyRectangle } from './SketchyRectangle';
import { Tape } from './Tape';

type Corner = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export interface TapedBoxProps {
  children: React.ReactNode;
  width?: number;
  height?: number;
  isBouncy?: boolean;
  borderRadius?: number;
  tapeCorners?: Corner[];
  className?: string;
}

/**
 * TapedBox - A container with sketchy rectangle border and tape on corners
 * Perfect for creating taped-down canvases and boxes
 *
 * @param children - Content to display inside
 * @param width - Box width (optional, will fit content if not provided)
 * @param height - Box height (optional, will fit content if not provided)
 * @param isBouncy - Animates the rectangle
 * @param borderRadius - Corner radius for rectangle
 * @param tapeCorners - Which corners should have tape (default: ['topLeft', 'topRight'])
 * @param className - Additional CSS classes
 */
export const TapedBox: React.FC<TapedBoxProps> = ({
  children,
  width,
  height,
  isBouncy,
  borderRadius,
  tapeCorners = ['topLeft', 'topRight'],
  className = '',
}) => {
  const { theme } = useFeebyTheme();
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      if (ref.current) {
        setSize({
          width: ref.current.offsetWidth,
          height: ref.current.offsetHeight,
        });
      }
    };

    // Use requestAnimationFrame to ensure DOM has updated
    requestAnimationFrame(() => {
      updateSize();
    });

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, height]);

  const containerStyle: CSSProperties = {
    position: 'relative',
    width,
    height,
  };

  const getTapeStyle = (corner: Corner): CSSProperties => {
    const base: CSSProperties = {
      position: 'absolute',
      zIndex: 10,
    };

    switch (corner) {
      case 'topLeft':
        return { ...base, top: '-0.5rem', left: '-0.75rem' };
      case 'topRight':
        return { ...base, top: '-0.5rem', right: '-0.75rem' };
      case 'bottomLeft':
        return { ...base, bottom: '-0.5rem', left: '-0.75rem' };
      case 'bottomRight':
        return { ...base, bottom: '-0.5rem', right: '-0.75rem' };
    }
  };

  const getTapeRotation = (corner: Corner): number => {
    switch (corner) {
      case 'topLeft':
        return -15;
      case 'topRight':
        return 15;
      case 'bottomLeft':
        return 15;
      case 'bottomRight':
        return -15;
    }
  };

  const contentStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
  };

  return (
    <div ref={ref} className={className} style={containerStyle}>
      {tapeCorners.includes('topLeft') && (
        <div style={getTapeStyle('topLeft')}>
          <Tape width={50} height={25} rotation={getTapeRotation('topLeft')} isBouncy={isBouncy} />
        </div>
      )}
      {tapeCorners.includes('topRight') && (
        <div style={getTapeStyle('topRight')}>
          <Tape width={50} height={25} rotation={getTapeRotation('topRight')} isBouncy={isBouncy} />
        </div>
      )}
      {tapeCorners.includes('bottomLeft') && (
        <div style={getTapeStyle('bottomLeft')}>
          <Tape width={50} height={25} rotation={getTapeRotation('bottomLeft')} isBouncy={isBouncy} />
        </div>
      )}
      {tapeCorners.includes('bottomRight') && (
        <div style={getTapeStyle('bottomRight')}>
          <Tape width={50} height={25} rotation={getTapeRotation('bottomRight')} isBouncy={isBouncy} />
        </div>
      )}
      {size.width > 0 && size.height > 0 && (
        <SketchyRectangle
          width={size.width}
          height={size.height}
          isBouncy={isBouncy}
          borderRadius={borderRadius}
          fill={theme === 'dark' ? '#0a0a0a' : 'white'}
        />
      )}
      <div style={contentStyle}>{children}</div>
    </div>
  );
};
