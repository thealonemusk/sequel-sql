import { useCallback, useState } from 'react';
import { Briefcase, TableProperties } from 'lucide-react';

import { levels } from './db/levels';
import { useGameEngine } from './hooks/useGameEngine';
import { useResizablePanels } from './hooks/useResizablePanels';

import { LandingPage } from './components/LandingPage';
import { LoadingScreen } from './components/LoadingScreen';
import { SchemaModal } from './components/SchemaModal';
import { StoryPanel } from './components/StoryPanel';
import { SqlEditor } from './components/SqlEditor';
import { ResultsTable } from './components/ResultsTable';

// ---------------------------------------------------------------------------
// App — two views: 'landing' → 'game'
// The DB starts initialising only when the user clicks "Begin Investigation",
// so the landing page loads instantly with no spinner.
// ---------------------------------------------------------------------------

type View = 'landing' | 'game';

function App() {
  const [view, setView] = useState<View>('landing');
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  const {
    isReady,
    schema,
    results,
    error,
    successMessage,
    runQuery,
    resetDatabase,
    clearFeedback,
    initDatabase,
  } = useGameEngine();

  const {
    sidebarWidthPct,
    editorHeightPx,
    isResizingH,
    isResizingV,
    startResizingH,
    startResizingV,
    editorContainerRef,
  } = useResizablePanels();

  const currentLevel = levels.find((l) => l.id === currentLevelId);

  // ── Landing → Game transition ──────────────────────────────────────────
  const handleStart = useCallback(() => {
    setView('game');
    initDatabase();        // begin WASM load now that the user asked for it
  }, [initDatabase]);

  // ── In-game actions ────────────────────────────────────────────────────
  const handleRunQuery = useCallback(
    (query: string) => {
      if (!currentLevel) return;
      runQuery(query, currentLevel.validator);
    },
    [currentLevel, runQuery],
  );

  const handleNextLevel = useCallback(() => {
    if (currentLevelId < levels.length) {
      setCurrentLevelId((prev) => prev + 1);
      clearFeedback();
    }
  }, [currentLevelId, clearFeedback]);

  const handleResetGame = useCallback(() => {
    resetDatabase();
    setCurrentLevelId(1);
  }, [resetDatabase]);

  const progressPct = Math.floor((currentLevelId / levels.length) * 100);

  // ── Render ──────────────────────────────────────────────────────────────
  if (view === 'landing') return <LandingPage onStart={handleStart} />;
  if (!isReady)           return <LoadingScreen />;
  if (!currentLevel)      return null;

  return (
    <div className="app-root">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-icon">
            <Briefcase size={20} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="header-title">SQL Detective</h1>
            <p className="header-subtitle">OmniCorp Security Audit</p>
          </div>
        </div>

        <div className="header-controls">
          <div className="progress-block">
            <div className="progress-labels">
              <span>Investigation Progress</span>
              <span className="progress-pct">{progressPct}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          <div className="level-badge">
            <span className="level-dot" aria-hidden="true" />
            Level {currentLevelId} / {levels.length}
          </div>

          <button className="btn btn--ghost" onClick={handleResetGame}>
            Reset Case
          </button>
        </div>
      </header>

      {/* ── Split layout ────────────────────────────────────────────────── */}
      <div className="layout-grid">
        <aside className="sidebar" style={{ width: `${sidebarWidthPct}%` }}>
          <StoryPanel level={currentLevel} />
        </aside>

        <div
          className={`resizer-h${isResizingH ? ' active' : ''}`}
          onMouseDown={startResizingH}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panels"
        >
          <div className="resizer-knob-h" />
        </div>

        <main className="main-content" style={{ width: `${100 - sidebarWidthPct}%` }}>
          <div ref={editorContainerRef}>
            <SqlEditor onRun={handleRunQuery} height={editorHeightPx} />
          </div>

          <div
            className={`resizer-v${isResizingV ? ' active' : ''}`}
            onMouseDown={startResizingV}
            role="separator"
            aria-orientation="horizontal"
            aria-label="Resize editor and results"
          >
            <div className="resizer-knob-v" />
          </div>

          <ResultsTable
            key={currentLevelId}
            results={results}
            error={error}
            successMessage={successMessage}
            answer={currentLevel.answer}
            onNext={handleNextLevel}
            onReset={handleResetGame}
            isLastLevel={currentLevelId === levels.length}
          />
        </main>
      </div>

      {/* ── Schema FAB ──────────────────────────────────────────────────── */}
      <button
        className="btn btn--schema-fab"
        onClick={() => setIsSchemaOpen(true)}
        aria-label="Open database schema"
      >
        <TableProperties size={16} strokeWidth={2.5} />
        Database Schema
      </button>

      {isSchemaOpen && (
        <SchemaModal schema={schema} onClose={() => setIsSchemaOpen(false)} />
      )}
    </div>
  );
}

export default App;
