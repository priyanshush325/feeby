import { CSSProperties } from 'react';

/**
 * Combine class names, filtering out falsy values
 */
export const cn = (...classes: (string | undefined | false | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Merge multiple style objects into one
 */
export const mergeStyles = (...styles: (CSSProperties | undefined)[]): CSSProperties => {
  return Object.assign({}, ...styles.filter(Boolean));
};

/**
 * Tailwind-like utility styles
 * Use these as inline styles for consistent spacing and layout
 */
export const tw = {
  // Flexbox
  flex: { display: 'flex' } as CSSProperties,
  flexCol: { display: 'flex', flexDirection: 'column' } as CSSProperties,
  itemsCenter: { alignItems: 'center' } as CSSProperties,
  itemsStart: { alignItems: 'flex-start' } as CSSProperties,
  justifyCenter: { justifyContent: 'center' } as CSSProperties,
  justifyBetween: { justifyContent: 'space-between' } as CSSProperties,

  // Gap
  gap1: { gap: '0.25rem' } as CSSProperties,
  gap2: { gap: '0.5rem' } as CSSProperties,
  gap4: { gap: '1rem' } as CSSProperties,

  // Padding
  p2: { padding: '0.5rem' } as CSSProperties,
  p3: { padding: '0.75rem' } as CSSProperties,
  p4: { padding: '1rem' } as CSSProperties,
  p6: { padding: '1.5rem' } as CSSProperties,

  // Margin
  mt2: { marginTop: '0.5rem' } as CSSProperties,
  mt4: { marginTop: '1rem' } as CSSProperties,
  mb2: { marginBottom: '0.5rem' } as CSSProperties,
  mb4: { marginBottom: '1rem' } as CSSProperties,

  // Sizing
  wFull: { width: '100%' } as CSSProperties,
  hFull: { height: '100%' } as CSSProperties,

  // Position
  relative: { position: 'relative' } as CSSProperties,
  absolute: { position: 'absolute' } as CSSProperties,
  inset0: { top: 0, right: 0, bottom: 0, left: 0 } as CSSProperties,

  // Effects
  shadow: { boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' } as CSSProperties,
  shadowMd: { boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' } as CSSProperties,
  shadowLg: { boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' } as CSSProperties,
  dropShadow: { filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))' } as CSSProperties,

  // Transitions
  transition: { transition: 'all 0.3s ease' } as CSSProperties,

  // Rounded
  rounded: { borderRadius: '0.25rem' } as CSSProperties,
  roundedLg: { borderRadius: '0.5rem' } as CSSProperties,
  roundedFull: { borderRadius: '9999px' } as CSSProperties,

  // Overflow
  overflowHidden: { overflow: 'hidden' } as CSSProperties,

  // Cursor
  cursorPointer: { cursor: 'pointer' } as CSSProperties,
};

/**
 * Color utility functions
 */
export const colorUtils = {
  /**
   * Darken a hex color by a percentage
   */
  darken: (hex: string, percent: number): string => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('');
    }
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    const factor = 1 - percent / 100;
    r = Math.min(255, Math.max(0, Math.floor(r * factor)));
    g = Math.min(255, Math.max(0, Math.floor(g * factor)));
    b = Math.min(255, Math.max(0, Math.floor(b * factor)));

    const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },

  /**
   * Lighten a hex color by a percentage
   */
  lighten: (hex: string, percent: number): string => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex.split('').map((char) => char + char).join('');
    }
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    const factor = 1 + percent / 100;
    r = Math.min(255, Math.max(0, Math.floor(r * factor)));
    g = Math.min(255, Math.max(0, Math.floor(g * factor)));
    b = Math.min(255, Math.max(0, Math.floor(b * factor)));

    const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  },
};
