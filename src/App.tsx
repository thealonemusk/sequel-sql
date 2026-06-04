import { useEffect, useState } from 'react';
import { gameEngine } from './db/GameEngine';
import { levels } from './db/levels';
import type { QueryResult } from './db/levels';
import { StoryPanel } from './components/StoryPanel';
import { SchemaViewer } from './components/SchemaViewer';
import { SqlEditor } from './components/SqlEditor';
import { ResultsTable } from './components/ResultsTable';
import { Briefcase } from 'lucide-react';

function App() {
    const [isReady, setIsReady] = useState(false);
    const [currentLevelId, setCurrentLevelId] = useState(1);
    const [schema, setSchema] = useState<any[][]>([]);
    
    const [results, setResults] = useState<QueryResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const currentLevel = levels.find(l => l.id === currentLevelId);

    // Resizing States (LeetCode Style)
    const [sidebarWidth, setSidebarWidth] = useState(360);
    const [editorHeight, setEditorHeight] = useState(160);
    const [isResizingH, setIsResizingH] = useState(false);
    const [isResizingV, setIsResizingV] = useState(false);

    const startResizingH = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingH(true);
    };

    const startResizingV = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsResizingV(true);
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isResizingH) {
                const newWidth = e.clientX;
                if (newWidth >= 280 && newWidth <= 650) {
                    setSidebarWidth(newWidth);
                }
            } else if (isResizingV) {
                const editorElement = document.getElementById('terminal');
                if (editorElement) {
                    const rect = editorElement.getBoundingClientRect();
                    const newHeight = e.clientY - rect.top;
                    if (newHeight >= 100 && newHeight <= window.innerHeight - 180) {
                        setEditorHeight(newHeight);
                    }
                }
            }
        };

        const handleMouseUp = () => {
            setIsResizingH(false);
            setIsResizingV(false);
        };

        if (isResizingH || isResizingV) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.userSelect = 'none';
            document.body.style.cursor = isResizingH ? 'col-resize' : 'row-resize';
        } else {
            document.body.style.userSelect = '';
            document.body.style.cursor = '';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizingH, isResizingV]);

    useEffect(() => {
        gameEngine.init().then(() => {
            setIsReady(true);
            setSchema(gameEngine.getSchema());
        });
    }, []);

    const handleRunQuery = (query: string) => {
        if (!isReady || !currentLevel) return;

        setError(null);
        setSuccessMsg(null);
        setResults([]);

        const { results: queryResults, error: queryError } = gameEngine.executeQuery(query);
        
        if (queryError) {
            setError(queryError);
            return;
        }

        setResults(queryResults);
        
        // After every query, update schema in case they ran CREATE/ALTER/INSERT/DELETE
        setSchema(gameEngine.getSchema());

        // Validate logic
        const validation = currentLevel.validator(queryResults, query);
        if (validation.success) {
            setSuccessMsg(validation.message);
        } else {
            setError(validation.message);
        }
    };

    const handleNextLevel = () => {
        if (currentLevelId < levels.length) {
            setCurrentLevelId(prev => prev + 1);
            setSuccessMsg(null);
            setError(null);
            setResults([]);
        }
    };

    const handleResetGame = () => {
        gameEngine.reset();
        setCurrentLevelId(1);
        setSuccessMsg(null);
        setError(null);
        setResults([]);
        setSchema(gameEngine.getSchema());
    };

    if (!isReady) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                background: 'var(--bg-color)', 
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)'
            }}>
                <div style={{
                    padding: '2.5rem',
                    background: 'var(--surface-color)',
                    border: '1px solid var(--surface-border)',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-soft)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        border: '3px solid var(--primary-light)',
                        borderTopColor: 'var(--primary-color)',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                    <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Initializing Database...</h2>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-muted)' }}>Setting up detective terminal workspace.</p>
                </div>
            </div>
        );
    }

    if (!currentLevel) return null;

    return (
        <div className="layout-grid">
            <aside className="sidebar" style={{ width: sidebarWidth }}>
                {/* Brand Header Card */}
                <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <Briefcase size={20} color="var(--primary-color)" style={{ strokeWidth: 2.5 }} />
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em' }}>SQL Detective</h2>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        OmniCorp Security Audit
                    </p>
                    <div className="level-badge" style={{ alignSelf: 'flex-start', marginTop: '0.35rem' }}>
                        <span style={{ 
                            display: 'inline-block', 
                            width: '8px', 
                            height: '8px', 
                            background: 'var(--primary-color)', 
                            borderRadius: '50%' 
                        }}></span>
                        Level {currentLevel.id} / {levels.length}
                    </div>
                </div>

                <StoryPanel level={currentLevel} />
                <SchemaViewer schemaData={schema} />
            </aside>

            {/* Horizontal Resize Divider */}
            <div 
                className={`resizer-h ${isResizingH ? 'active' : ''}`}
                onMouseDown={startResizingH}
            >
                <div className="resizer-knob-h" />
            </div>

            <main className="main-content">
                <SqlEditor onRun={handleRunQuery} height={editorHeight} />
                
                {/* Vertical Resize Divider */}
                <div 
                    className={`resizer-v ${isResizingV ? 'active' : ''}`}
                    onMouseDown={startResizingV}
                >
                    <div className="resizer-knob-v" />
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                    <ResultsTable 
                        results={results} 
                        error={error} 
                        successMessage={successMsg} 
                        onNext={handleNextLevel}
                        onReset={handleResetGame}
                        isLastLevel={currentLevelId === levels.length}
                    />
                </div>
            </main>
        </div>
    );
}

export default App;
