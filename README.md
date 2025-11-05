# 🎨 Feeby

> Hand-drawn React components using RoughJS - create sketchy, playful UIs

Feeby is a collection of hand-drawn, sketch-style React components built with [RoughJS](https://roughjs.com/). Perfect for creating playful, creative, and unique user interfaces with a hand-drawn aesthetic.

## Features

- **Hand-drawn Style**: All components use RoughJS for authentic sketchy look
- **Theme Support**: Built-in light/dark theme support
- **TypeScript**: Full TypeScript support with exported types
- **Animated Options**: Many components support "bouncy" animations
- **Framework Agnostic**: Works with any React setup (Next.js, Vite, CRA, etc.)
- **Zero CSS Dependencies**: No Tailwind or CSS frameworks required

## Installation

```bash
npm install feeby
# or
yarn add feeby
# or
pnpm add feeby
```

## Quick Start

### 1. Wrap your app with the theme provider

```tsx
import { FeebyThemeProvider } from 'feeby';

function App() {
  return (
    <FeebyThemeProvider defaultTheme="light">
      {/* Your app */}
    </FeebyThemeProvider>
  );
}
```

### 2. Use components

```tsx
import { SketchyButton, SketchyText, StickyNote } from 'feeby';

function MyComponent() {
  return (
    <div>
      <SketchyText as="h1">Hello Feeby!</SketchyText>

      <SketchyButton color="#3b82f6" onClick={() => alert('Clicked!')}>
        Click Me
      </SketchyButton>

      <StickyNote
        title="My Note"
        company="Feeby Inc."
        date="2025"
        color="#fef08a"
      >
        This is a sticky note with hand-drawn styling!
      </StickyNote>
    </div>
  );
}
```

## Components

### Core Components

#### `<SketchyText>`
Text with sketchy shadow effects that adapt to theme.

```tsx
<SketchyText as="h1" className="my-heading">
  Hand-drawn Title
</SketchyText>
```

**Props:**
- `children`: React.ReactNode
- `className?`: string
- `as?`: React.ElementType (default: 'span')
- `style?`: CSSProperties

---

#### `<SketchyButton>`
Button with hand-drawn background and hover effects.

```tsx
<SketchyButton
  color="#10b981"
  onClick={() => console.log('clicked')}
>
  Click Me!
</SketchyButton>
```

**Props:**
- `children`: React.ReactNode
- `color?`: string - Background hachure color
- `onClick?`: () => void
- `className?`: string
- `style?`: CSSProperties

---

#### `<SketchyBackground>`
Hachure-filled background that fills its container.

```tsx
<div style={{ width: 200, height: 200, position: 'relative' }}>
  <SketchyBackground color="#3b82f6" isBouncy />
</div>
```

**Props:**
- `color?`: string - Hachure fill color
- `isBouncy?`: boolean - Enables animation

---

#### `<SketchyRectangle>`
Hand-drawn rectangle with optional rounded corners.

```tsx
<SketchyRectangle
  width={300}
  height={200}
  borderRadius={15}
  isBouncy
  fill="#fef08a"
/>
```

**Props:**
- `width`: number
- `height`: number
- `borderRadius?`: number
- `isBouncy?`: boolean
- `strokeWidth?`: number
- `fill?`: string

---

### Note Components

#### `<StickyNote>`
Feature-rich sticky note with optional logo, folded corners, and skill tags.

```tsx
<StickyNote
  title="Software Engineer"
  company="Tech Corp"
  date="2023-2025"
  color="#ffec99"
  rotation={-2}
  foldedCorner="topRight"
  skills={['React', 'TypeScript', 'Node.js']}
  logoComponent={<img src="/logo.png" width={24} />}
>
  Built amazing things with amazing people.
</StickyNote>
```

**Props:**
- `title`: string
- `company`: string
- `date`: string
- `children`: React.ReactNode
- `color?`: string (default: '#ffec99')
- `rotation?`: number (default: -2)
- `foldedCorner?`: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'none'
- `foldSize?`: number
- `isBouncy?`: boolean
- `width?`: number (default: 256)
- `height?`: number (default: 256)
- `logoComponent?`: React.ReactNode
- `skills?`: string[]
- `fontFamily?`: string

---

#### `<PinnedNote>`
Sticky note with a push pin, optionally linkable.

```tsx
<PinnedNote
  title="My Project"
  description="A cool side project"
  color="#fef08a"
  href="https://example.com"
  icon="cube"
  rotation={3}
>
  Additional content here
</PinnedNote>
```

**Props:**
- `title`: string
- `description?`: string
- `color?`: string (default: '#fef08a')
- `pinColor?`: string (default: '#ef4444')
- `rotation?`: number
- `width?`: number (default: 200)
- `height?`: number (default: 200)
- `children?`: React.ReactNode
- `href?`: string - Makes it clickable
- `icon?`: 'cube' | 'microphone' | 'book' | null
- `pinPosition?`: 'left' | 'center' | 'right'
- `fontFamily?`: string
- `LinkComponent?`: React.ComponentType - Custom link component (e.g., Next.js Link)

---

#### `<StickyTape>`
Colorful tape labels with text, perfect for tags.

```tsx
<StickyTape
  text="React"
  width={80}
  height={24}
  rotation={-3}
  isBouncy
/>
```

**Props:**
- `text`: string
- `width?`: number (default: 100)
- `height?`: number (default: 25)
- `rotation?`: number
- `isBouncy?`: boolean
- `color?`: string - Custom color (random pastel if not provided)
- `fontFamily?`: string

---

### Container Components

#### `<TapedBox>`
Container with sketchy rectangle and tape on corners.

```tsx
<TapedBox
  width={400}
  height={300}
  borderRadius={20}
  tapeCorners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
  isBouncy
>
  Your content here
</TapedBox>
```

**Props:**
- `children`: React.ReactNode
- `width?`: number
- `height?`: number
- `isBouncy?`: boolean
- `borderRadius?`: number
- `tapeCorners?`: Array<'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'>
- `className?`: string

---

### Decorative Elements

#### `<Tape>`
Single piece of sketchy tape.

```tsx
<Tape width={50} height={25} rotation={15} />
```

**Props:**
- `width`: number
- `height`: number
- `rotation?`: number

---

#### `<ThumbTack>`
Decorative push pin / thumb tack.

```tsx
<ThumbTack width={40} height={50} isBouncy />
```

**Props:**
- `className?`: string
- `width?`: number (default: 40)
- `height?`: number (default: 50)
- `isBouncy?`: boolean

---

#### `<FoldedCorner>`
Folded paper corner effect.

```tsx
<FoldedCorner
  corner="topRight"
  size={30}
  baseColor="#ffec99"
  isBouncy
/>
```

**Props:**
- `corner`: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'
- `size?`: number (default: 30)
- `baseColor`: string
- `className?`: string
- `isBouncy?`: boolean

---

## Theme System

Feeby includes a built-in theme system for light/dark mode support.

### Using the Theme Hook

```tsx
import { useFeebyTheme } from 'feeby';

function ThemeToggle() {
  const { theme, setTheme, toggleTheme } = useFeebyTheme();

  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
}
```

### Custom Storage Key

```tsx
<FeebyThemeProvider defaultTheme="dark" storageKey="my-app-theme">
  <App />
</FeebyThemeProvider>
```

## Utility Functions

Feeby exports helpful utility functions for styling:

```tsx
import { tw, mergeStyles, cn, colorUtils } from 'feeby';

// Tailwind-like utilities for inline styles
const buttonStyle = mergeStyles(
  tw.flex,
  tw.itemsCenter,
  tw.gap2,
  tw.roundedFull,
  { backgroundColor: '#3b82f6' }
);

// Color utilities
const darkColor = colorUtils.darken('#3b82f6', 20);
const lightColor = colorUtils.lighten('#3b82f6', 20);

// Class name utility
const classes = cn('base-class', condition && 'conditional-class');
```

## 🎯 Usage with Different Frameworks

### Next.js (App Router)

```tsx
// app/layout.tsx
import { FeebyThemeProvider } from 'feeby';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <FeebyThemeProvider defaultTheme="light">
          {children}
        </FeebyThemeProvider>
      </body>
    </html>
  );
}
```

### Next.js (Pages Router)

```tsx
// pages/_app.tsx
import { FeebyThemeProvider } from 'feeby';

export default function App({ Component, pageProps }) {
  return (
    <FeebyThemeProvider>
      <Component {...pageProps} />
    </FeebyThemeProvider>
  );
}
```

### Vite / Create React App

```tsx
// main.tsx / index.tsx
import { FeebyThemeProvider } from 'feeby';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <FeebyThemeProvider>
    <App />
  </FeebyThemeProvider>
);
```

## Customization

### Custom Fonts

Many components accept a `fontFamily` prop for custom fonts:

```tsx
<StickyNote
  title="My Note"
  company="Company"
  date="2025"
  fontFamily="'Comic Sans MS', cursive"
>
  Custom font content
</StickyNote>
```

### Custom Colors

All components support custom colors via props:

```tsx
<SketchyButton color="#ff6b6b">Red Button</SketchyButton>
<StickyNote color="#b8e6ff">Blue Note</StickyNote>
<StickyTape text="Tag" color="rgba(255, 200, 100, 0.8)" />
```

## TypeScript

Feeby is built with TypeScript and exports all component prop types:

```tsx
import type { StickyNoteProps, SketchyButtonProps } from 'feeby';

const noteConfig: StickyNoteProps = {
  title: 'My Note',
  company: 'Company',
  date: '2025',
  children: 'Content',
  color: '#ffec99',
};
```

## Contributing

Contributions are welcome! This package was extracted from a personal website to share the hand-drawn component library with the community.

## License

MIT © Priyanshu Sharma

## Acknowledgments

- Built with [RoughJS](https://roughjs.com/) by Preet Shihn
- Inspired by hand-drawn UI design patterns

---

**Made with ❤️ and a sketchy pencil**
