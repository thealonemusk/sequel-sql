import { useState } from 'react';
import type { QueryResult } from '../db/levels';
import { Table, AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface ResultsTableProps {
    results: QueryResult[];
    error: string | null;
    successMessage: string | null;
    answer?: string;
    onNext?: () => void;
    onReset?: () => void;
    isLastLevel?: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ 
    results, 
    error, 
    successMessage,
    answer,
    onNext,
    onReset,
    isLastLevel
}) => {
    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <div className="panel results-container" style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', flexShrink: 0 }}>
                <div style={{ 
                    background: 'var(--primary-light)', 
                    padding: '0.5rem', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary-color)'
                }}>
                    <Table size={18} style={{ strokeWidth: 2.5 }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', flex: 1 }}>Query Results</h3>
            </div>

            {error && (
                <div style={{ flexShrink: 0, marginBottom: '0.75rem' }}>
                    <div className="alert error" style={{ padding: '0.65rem 0.85rem', fontSize: '0.85rem', marginBottom: answer ? '0.5rem' : 0 }}>
                        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '1px', strokeWidth: 2.5 }} />
                        <span>{error}</span>
                    </div>

                    {answer && (
                        <div>
                            <button
                                onClick={() => setShowAnswer(prev => !prev)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    background: 'none',
                                    border: '1px solid rgba(99, 102, 241, 0.35)',
                                    borderRadius: '8px',
                                    color: '#818cf8',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    padding: '0.35rem 0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    marginTop: '0.4rem'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(99, 102, 241, 0.1)';
                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'none';
                                    e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.35)';
                                }}
                            >
                                {showAnswer
                                    ? <><EyeOff size={13} style={{ strokeWidth: 2.5 }} /> Hide Answer</>
                                    : <><Eye size={13} style={{ strokeWidth: 2.5 }} /> Show Answer</>
                                }
                            </button>

                            {showAnswer && (
                                <div style={{
                                    marginTop: '0.5rem',
                                    background: 'rgba(15, 23, 42, 0.6)',
                                    border: '1px solid rgba(99, 102, 241, 0.25)',
                                    borderRadius: '10px',
                                    padding: '0.75rem 1rem',
                                    fontSize: '0.82rem',
                                    fontFamily: 'var(--font-mono, monospace)',
                                    color: '#a5b4fc',
                                    lineHeight: '1.6',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word'
                                }}>
                                    {answer}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {successMessage && (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'row', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    gap: '0.75rem', 
                    marginBottom: '0.75rem',
                    flexShrink: 0 
                }}>
                    <div className="alert success" style={{ margin: 0, flex: 1, padding: '0.65rem 0.85rem', fontSize: '0.85rem' }}>
                        <CheckCircle2 size={16} style={{ flexShrink: 0, marginTop: '1px', strokeWidth: 2.5 }} />
                        <span>{successMessage}</span>
                    </div>
                    {isLastLevel ? (
                        <button 
                            className="btn" 
                            onClick={onReset} 
                            style={{ 
                                flexShrink: 0,
                                padding: '0.55rem 1.15rem',
                                fontSize: '0.825rem',
                                background: 'var(--primary-color)', 
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' 
                            }}
                        >
                            Reset & Play Again
                        </button>
                    ) : (
                        <button 
                            className="btn" 
                            onClick={onNext} 
                            style={{ 
                                flexShrink: 0,
                                padding: '0.55rem 1.15rem',
                                fontSize: '0.825rem',
                                background: 'var(--primary-color)', 
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' 
                            }}
                        >
                            Continue &rarr;
                        </button>
                    )}
                </div>
            )}

            {!error && results.length === 0 && !successMessage && (
                <div style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    padding: '4rem 2rem',
                    textAlign: 'center',
                    gap: '0.75rem',
                    flexGrow: 1
                }}>
                    <div style={{ 
                        background: '#f1f5f9', 
                        color: 'var(--text-muted)', 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '14px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center' 
                    }}>
                        <Table size={22} style={{ strokeWidth: 2 }} />
                    </div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>Terminal Ready</h4>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
                        Run a SELECT, JOIN or UPDATE query to inspect database records.
                    </p>
                </div>
            )}

            {results.map((res, i) => (
                <div key={i} className="table-wrapper">
                    <table>
                        <thead>
                            <tr>
                                {res.columns.map((col, j) => (
                                    <th key={j}>{col}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {res.values.map((row, rIdx) => (
                                <tr key={rIdx}>
                                    {row.map((val, cIdx) => (
                                        <td key={cIdx}>{val !== null ? String(val) : 'NULL'}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};
