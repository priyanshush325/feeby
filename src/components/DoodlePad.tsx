import { useEffect, useRef, useState, CSSProperties, ReactNode } from 'react';
import rough from 'roughjs/bin/rough';
import { TapedBox } from './TapedBox';
import { useFeebyTheme } from '../context/ThemeContext';

interface Stroke {
  points: [number, number][];
  mode: 'pen' | 'eraser';
}

export interface DoodlePadProps {
  width?: number;
  height?: number;
  isBouncy?: boolean;
  onStrokesChange?: (strokes: Stroke[]) => void;
  toolbarLeft?: ReactNode;
  toolbarRight?: ReactNode;
}

/**
 * DoodlePad - An interactive sketchy drawing canvas
 * Draw with pen or erase using the eraser tool
 *
 * @param width - Canvas width (defaults to container width)
 * @param height - Canvas height (defaults to width * 0.8)
 * @param isBouncy - Animates the taped box border (default: true)
 * @param onStrokesChange - Callback when strokes change
 * @param toolbarLeft - Custom toolbar content on the left
 * @param toolbarRight - Custom toolbar content on the right
 */
export const DoodlePad: React.FC<DoodlePadProps> = ({
  width,
  height,
  isBouncy = true,
  onStrokesChange,
  toolbarLeft,
  toolbarRight,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const { theme } = useFeebyTheme();
  const [size, setSize] = useState({ width: width || 0, height: height || 0 });

  useEffect(() => {
    if (width && height) {
      setSize({ width, height });
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const updateSize = () => {
      const containerWidth = container.offsetWidth;
      if (containerWidth > 0) {
        setSize({ width: containerWidth, height: containerWidth * 0.8 });
      }
    };

    updateSize();

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        const containerWidth = entry.contentRect.width;
        setSize({ width: containerWidth, height: containerWidth * 0.8 });
      }
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
    };
  }, [width, height]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || size.width === 0) return;
    const rc = rough.canvas(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach(({ points, mode: strokeMode }) => {
      if (points.length > 1) {
        if (strokeMode === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
        }

        rc.linearPath(points, {
          stroke: theme === 'dark' ? '#ededed' : '#000',
          strokeWidth: strokeMode === 'pen' ? 3 : 20,
          roughness: 1.5,
        });

        if (strokeMode === 'eraser') {
          ctx.globalCompositeOperation = 'source-over';
        }
      }
    });
  }, [strokes, theme, size]);

  useEffect(() => {
    if (onStrokesChange) {
      onStrokesChange(strokes);
    }
  }, [strokes, onStrokesChange]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);

    const newStroke: Stroke = {
      points: [[e.nativeEvent.offsetX, e.nativeEvent.offsetY]],
      mode: mode,
    };
    setStrokes((prevStrokes) => [...prevStrokes, newStroke]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    setStrokes((prevStrokes) => {
      const newStrokes = [...prevStrokes];
      const currentStroke = newStrokes[newStrokes.length - 1];
      currentStroke.points.push([e.nativeEvent.offsetX, e.nativeEvent.offsetY]);
      return newStrokes;
    });
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const handleMouseLeave = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    setStrokes([]);
  };

  const containerStyle: CSSProperties = {
    width: '100%',
  };

  const contentContainerStyle: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const toolbarStyle: CSSProperties = {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const toolbarLeftDefaultStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  };

  const buttonStyle: CSSProperties = {
    padding: '0.5rem',
    borderRadius: '9999px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  };

  const activeButtonStyle: CSSProperties = {
    ...buttonStyle,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={contentContainerStyle}>
        <TapedBox
          width={size.width}
          height={size.height}
          isBouncy={isBouncy}
          borderRadius={20}
          tapeCorners={['topLeft', 'topRight', 'bottomLeft', 'bottomRight']}
        >
          <canvas
            ref={canvasRef}
            width={size.width}
            height={size.height}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: mode === 'pen' ? 'crosshair' : 'pointer' }}
          />
        </TapedBox>

        <div style={toolbarStyle}>
          {toolbarLeft || (
            <div style={toolbarLeftDefaultStyle}>
              <button
                style={mode === 'pen' ? activeButtonStyle : buttonStyle}
                onClick={() => setMode('pen')}
                aria-label="Pen"
                onMouseEnter={(e) => {
                  if (mode !== 'pen') {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'pen') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                ✏️
              </button>
              <button
                style={mode === 'eraser' ? activeButtonStyle : buttonStyle}
                onClick={() => setMode('eraser')}
                aria-label="Eraser"
                onMouseEnter={(e) => {
                  if (mode !== 'eraser') {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (mode !== 'eraser') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                🧹
              </button>
              <button
                style={buttonStyle}
                onClick={handleClear}
                aria-label="Clear"
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                🔄
              </button>
            </div>
          )}
          {toolbarRight}
        </div>
      </div>
    </div>
  );
};
