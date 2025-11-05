import React, { CSSProperties } from 'react';
import { SketchyBackground } from './SketchyBackground';

export interface SketchyButtonProps {
  children: React.ReactNode;
  color?: string;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

/**
 * SketchyButton - A button with hand-drawn background and hover effects
 *
 * @param children - Button content
 * @param color - Background color (uses SketchyBackground hachure fill)
 * @param onClick - Click handler
 * @param className - Additional CSS classes
 * @param style - Additional inline styles
 */
export const SketchyButton: React.FC<SketchyButtonProps> = ({
  children,
  color,
  onClick,
  className = '',
  style,
}) => {
  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    whiteSpace: 'nowrap',
    borderRadius: '9999px',
    padding: '0.5rem 1.5rem',
    fontSize: '1.125rem',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    cursor: 'pointer',
    border: 'none',
    background: 'transparent',
    ...style,
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1.1) rotate(-2deg)';
    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgb(0 0 0 / 0.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
  };

  return (
    <button
      onClick={onClick}
      className={className}
      style={buttonStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{
        position: 'absolute',
        inset: 0,
        borderRadius: '9999px',
        overflow: 'hidden'
      }}>
        {color && <SketchyBackground color={color} isBouncy />}
      </div>
      <span style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        {children}
      </span>
    </button>
  );
};
