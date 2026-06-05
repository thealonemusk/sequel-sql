import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// useResizablePanels
// Manages horizontal (sidebar / main) and vertical (editor / results) resize
// drag state.  All DOM mutation is handled inside this hook so components
// stay free of resize logic.
// ---------------------------------------------------------------------------

const SIDEBAR_MIN_PCT = 20;
const SIDEBAR_MAX_PCT = 80;
const EDITOR_HEIGHT_MIN_PX = 120;
const EDITOR_HEIGHT_MAX_PX = 800;
const EDITOR_HEIGHT_DEFAULT_RATIO = 0.5;
const SIDEBAR_DEFAULT_PCT = 40;

interface ResizablePanelState {
  sidebarWidthPct: number;
  editorHeightPx: number;
  isResizingH: boolean;
  isResizingV: boolean;
}

interface ResizablePanelActions {
  startResizingH: (e: React.MouseEvent) => void;
  startResizingV: (e: React.MouseEvent) => void;
  /** Ref to attach to the vertically-resizable container so height origin is computed correctly. */
  editorContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useResizablePanels(): ResizablePanelState & ResizablePanelActions {
  const [sidebarWidthPct, setSidebarWidthPct] = useState(SIDEBAR_DEFAULT_PCT);
  const [editorHeightPx, setEditorHeightPx] = useState(300);
  const [isResizingH, setIsResizingH] = useState(false);
  const [isResizingV, setIsResizingV] = useState(false);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);

  // Set a sensible default height once we know the viewport
  useEffect(() => {
    setEditorHeightPx(
      Math.max(
        EDITOR_HEIGHT_MIN_PX,
        Math.floor(window.innerHeight * EDITOR_HEIGHT_DEFAULT_RATIO),
      ),
    );
  }, []);

  const startResizingH = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingH(true);
  }, []);

  const startResizingV = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingV(true);
  }, []);

  useEffect(() => {
    if (!isResizingH && !isResizingV) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingH) {
        const pct = (e.clientX / window.innerWidth) * 100;
        if (pct >= SIDEBAR_MIN_PCT && pct <= SIDEBAR_MAX_PCT) {
          setSidebarWidthPct(pct);
        }
      } else if (isResizingV && editorContainerRef.current) {
        const rect = editorContainerRef.current.getBoundingClientRect();
        const newHeight = e.clientY - rect.top;
        if (newHeight >= EDITOR_HEIGHT_MIN_PX && newHeight <= EDITOR_HEIGHT_MAX_PX) {
          setEditorHeightPx(newHeight);
        }
      }
    };

    const handleMouseUp = () => {
      setIsResizingH(false);
      setIsResizingV(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = 'none';
    document.body.style.cursor = isResizingH ? 'col-resize' : 'row-resize';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isResizingH, isResizingV]);

  return {
    sidebarWidthPct,
    editorHeightPx,
    isResizingH,
    isResizingV,
    startResizingH,
    startResizingV,
    editorContainerRef,
  };
}
