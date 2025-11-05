// Context & Hooks
export { FeebyThemeProvider, useFeebyTheme } from './context/ThemeContext';

// Utility Functions
export { tw, mergeStyles, cn, colorUtils } from './utils/styles';

// Core Components
export { SketchyBackground } from './components/SketchyBackground';
export { SketchyText } from './components/SketchyText';
export { SketchyButton } from './components/SketchyButton';
export { SketchyRectangle } from './components/SketchyRectangle';

// Note Components
export { StickyNote } from './components/StickyNote';
export { PinnedNote } from './components/PinnedNote';
export { StickyTape } from './components/StickyTape';

// Decorative Elements
export { Tape } from './components/Tape';
export { ThumbTack } from './components/ThumbTack';
export { FoldedCorner } from './components/FoldedCorner';

// Container Components
export { TapedBox } from './components/TapedBox';

// Type Exports
export type { SketchyBackgroundProps } from './components/SketchyBackground';
export type { SketchyTextProps } from './components/SketchyText';
export type { SketchyButtonProps } from './components/SketchyButton';
export type { SketchyRectangleProps } from './components/SketchyRectangle';
export type { StickyNoteProps } from './components/StickyNote';
export type { PinnedNoteProps } from './components/PinnedNote';
export type { StickyTapeProps } from './components/StickyTape';
export type { TapeProps } from './components/Tape';
export type { ThumbTackProps } from './components/ThumbTack';
export type { FoldedCornerProps } from './components/FoldedCorner';
export type { TapedBoxProps } from './components/TapedBox';

// TODO: Add remaining components as you migrate them:
// - BinderPaper
// - CrumpledPaper
// - RippedBanner
// - DoodlePad
// - PaperAirplane
// - BulletinBoard
// - TrashCan
// - FragranceCard
// - JourneyLine
// - VoteTriangle
// - SketchySocialIcon
// - SocialsBox
// - SocialsLabel
