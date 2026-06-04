import { useEffect, useState } from 'react';
import { gameEngine } from './db/GameEngine';
import { levels } from './db/levels';
import type { QueryResult } from './db/levels';
import { StoryPanel } from './components/StoryPanel';
import { SchemaViewer } from './components/SchemaViewer';
import { SqlEditor } from './components/SqlEditor';
import { ResultsTable } from './components/ResultsTable';
import { Briefcase, TableProperties } from 'lucide-react';

function App() {
    const [isReady, setIsReady] = useState(false);
    const [currentLevelId, setCurrentLevelId] = useState(1);
    const [schema, setSchema] = useState<any[][]>([]);
    const [isSchemaOpen, setIsSchemaOpen] = useState(false);
    
    const [results, setResults] = useState<QueryResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const currentLevel = levels.find(l => l.id === currentLevelId);

    // Resizing States (Proportional Horizontal, Pixel Vertical)
    const [sidebarWidthPercent, setSidebarWidthPercent] = useState(40); // 40% default
    const [editorHeight, setEditorHeight] = useState(300); // Default editor height (updated on mount)
    const [isResizingH, setIsResizingH] = useState(false);
    const [isResizingV, setIsResizingV] = useState(false);

    // Set default editor height based on window height on mount
    useEffect(() => {
        setEditorHeight(Math.max(200, Math.floor(window.innerHeight * 0.5)));
    }, []);

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
                const newPercent = (e.clientX / window.innerWidth) * 100;
                if (newPercent >= 20 && newPercent <= 80) {
                    setSidebarWidthPercent(newPercent);
                }
            } else if (isResizingV) {
                const editorElement = document.getElementById('terminal');
                if (editorElement) {
                    const rect = editorElement.getBoundingClientRect();
                    const newHeight = e.clientY - rect.top;
                    if (newHeight >= 120 && newHeight <= 800) {
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', background: 'var(--bg-color)', boxSizing: 'border-box' }}>
            {/* Top Horizontal Dashboard */}
            <header style={{
                background: 'var(--surface-color)',
                borderBottom: '1px solid var(--surface-border-strong)',
                padding: '1rem 2rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: 'var(--shadow-soft)',
                zIndex: 80,
                position: 'sticky',
                top: 0,
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary-color)',
                        width: '38px',
                        height: '38px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.15)'
                    }}>
                        <Briefcase size={20} style={{ strokeWidth: 2.5 }} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: '1.2' }}>
                            SQL Detective
                        </h1>
                        <p style={{ margin: 0, fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            OmniCorp Security Audit
                        </p>
                    </div>
                </div>

                {/* Dashboard Stats & Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    {/* Progress Bar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '200px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            <span>Investigation Progress</span>
                            <span>{Math.floor((currentLevelId / levels.length) * 100)}%</span>
                        </div>
                        <div style={{ background: '#f1f5f9', height: '6px', borderRadius: '10px', overflow: 'hidden' }}>
                            <div style={{ 
                                background: 'linear-gradient(90deg, var(--primary-color), #818cf8)', 
                                width: `${(currentLevelId / levels.length) * 100}%`, 
                                height: '100%', 
                                borderRadius: '10px',
                                transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }} />
                        </div>
                    </div>

                    <div className="level-badge" style={{ margin: 0 }}>
                        <span style={{ 
                            display: 'inline-block', 
                            width: '8px', 
                            height: '8px', 
                            background: 'var(--primary-color)', 
                            borderRadius: '50%' 
                        }}></span>
                        Level {currentLevelId} / {levels.length}
                    </div>

                    <button 
                        onClick={handleResetGame}
                        className="btn"
                        style={{
                            background: '#f1f5f9',
                            color: 'var(--text-primary)',
                            padding: '0.5rem 1rem',
                            fontSize: '0.8rem',
                            borderRadius: '10px',
                            boxShadow: 'none',
                            border: '1px solid var(--surface-border-strong)'
                        }}
                        onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                        onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
                    >
                        Reset Case
                    </button>
                </div>
            </header>

            {/* Split Screen Resizable Layout Area */}
            <div className="layout-grid" style={{ flex: 1, minHeight: 'calc(100vh - 71px)' }}>
                <aside className="sidebar" style={{ width: `${sidebarWidthPercent}%` }}>
                    <StoryPanel level={currentLevel} />
                </aside>

            {/* Horizontal Resize Divider */}
            <div 
                className={`resizer-h ${isResizingH ? 'active' : ''}`}
                onMouseDown={startResizingH}
            >
                <div className="resizer-knob-h" />
            </div>

            <main className="main-content" style={{ width: `${100 - sidebarWidthPercent}%` }}>
                <SqlEditor onRun={handleRunQuery} height={editorHeight} />
                
                {/* Vertical Resize Divider */}
                <div 
                    className={`resizer-v ${isResizingV ? 'active' : ''}`}
                    onMouseDown={startResizingV}
                >
                    <div className="resizer-knob-v" />
                </div>

                <ResultsTable 
                    results={results} 
                    error={error} 
                    successMessage={successMsg} 
                    onNext={handleNextLevel}
                    onReset={handleResetGame}
                    isLastLevel={currentLevelId === levels.length}
                />
            </main>
            </div>

            {/* Floating Schema Button on bottom-right */}
            <button
                onClick={() => setIsSchemaOpen(true)}
                className="btn"
                style={{
                    position: 'fixed',
                    right: '1.5rem',
                    bottom: '1.5rem',
                    zIndex: 90,
                    boxShadow: '0 8px 30px rgba(99, 102, 241, 0.25)',
                    background: 'var(--primary-color)',
                    borderRadius: '50px',
                    padding: '0.75rem 1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: 700,
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                }}
            >
                <TableProperties size={16} style={{ strokeWidth: 2.5 }} />
                Database Schema
            </button>

            {/* Modal Overlay */}
            {isSchemaOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(15, 23, 42, 0.4)',
                    backdropFilter: 'blur(8px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }} onClick={() => setIsSchemaOpen(false)}>
                    <div 
                        style={{
                            background: 'var(--surface-color)',
                            borderRadius: '24px',
                            width: '100%',
                            maxWidth: '640px',
                            maxHeight: '80vh',
                            overflowY: 'auto',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                            border: '1px solid var(--surface-border-strong)',
                            position: 'relative',
                            animation: 'modalFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                        }} 
                        onClick={e => e.stopPropagation()}
                    >
                        <button 
                            onClick={() => setIsSchemaOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: '50%',
                                width: '32px',
                                height: '32px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                color: 'var(--text-secondary)',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.background = '#e2e8f0'}
                            onMouseOut={e => e.currentTarget.style.background = '#f1f5f9'}
                        >
                            &times;
                        </button>
                        <div style={{ padding: '2rem' }}>
                            <SchemaViewer schemaData={schema} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
