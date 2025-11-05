import { CSSProperties } from 'react';
import { useFeebyTheme } from '../context/ThemeContext';

export interface SketchyTextProps {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  style?: CSSProperties;
}

/**
 * SketchyText - Text with a sketchy shadow effect
 * Creates a layered shadow effect that adapts to light/dark themes
 *
 * @param children - Text content to display
 * @param className - Additional CSS classes
 * @param as - HTML element type (default: 'span')
 * @param style - Additional inline styles
 */
export const SketchyText: React.FC<SketchyTextProps> = ({
  children,
  className = '',
  as: Component = 'span',
  style,
}) => {
  const { theme } = useFeebyTheme();

  const dark = theme === 'dark';
  const textColor = dark ? '#fff' : '#000';
  const textOutlineColor = dark ? '#000' : '#fff';
  const accentColor = dark ? 'rgb(59 130 246)' : 'rgb(156 163 175)';

  const shadows = [
    `-1px -1px 0 ${textOutlineColor}`,
    ` 1px -1px 0 ${textOutlineColor}`,
    `-1px  1px 0 ${textOutlineColor}`,
    ` 1px  1px 0 ${textOutlineColor}`,
    `1px 1px 0 ${accentColor}`,
    `2px 2px 0 ${accentColor}`,
    `3px 3px 0 ${accentColor}`,
    `4px 4px 0 ${accentColor}`,
    `5px 5px 0 ${accentColor}`,
  ].join(', ');

  return (
    <Component
      className={className}
      style={{
        color: textColor,
        textShadow: shadows,
        ...style
      }}
    >
      {children}
    </Component>
  );
};
