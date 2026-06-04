import type { QueryResult } from '../db/levels';
import { Table, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResultsTableProps {
    results: QueryResult[];
    error: string | null;
    successMessage: string | null;
    onNext?: () => void;
    onReset?: () => void;
    isLastLevel?: boolean;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ 
    results, 
    error, 
    successMessage,
    onNext,
    onReset,
    isLastLevel
}) => {
    return (
        <div className="panel results-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexShrink: 0 }}>
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
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Query Results</h3>
            </div>

            {error && (
                <div className="alert error">
                    <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px', strokeWidth: 2.5 }} />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.25rem' }}>
                    <div className="alert success" style={{ marginBottom: 0 }}>
                        <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: '2px', strokeWidth: 2.5 }} />
                        <span>{successMessage}</span>
                    </div>
                    {isLastLevel ? (
                        <button 
                            className="btn" 
                            onClick={onReset} 
                            style={{ 
                                alignSelf: 'flex-start', 
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
                                alignSelf: 'flex-start', 
                                background: 'var(--primary-color)', 
                                boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' 
                            }}
                        >
                            Continue to Next Level &rarr;
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
