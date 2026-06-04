import type { Level } from '../db/levels';
import { Terminal, CheckSquare, Table } from 'lucide-react';

interface StoryPanelProps {
    level: Level;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ level }) => {
    return (
        <div id="story" className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ 
                    background: 'var(--primary-light)', 
                    padding: '0.5rem', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary-color)'
                }}>
                    <Terminal size={18} style={{ strokeWidth: 2.5 }} />
                </div>
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{level.title}</h2>
            </div>
            
            <div style={{ 
                background: 'rgba(99, 102, 241, 0.03)', 
                padding: '1.25rem', 
                borderRadius: '14px', 
                borderLeft: '4px solid var(--primary-color)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
            }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', fontWeight: 500 }}>
                    {level.story}
                </p>
            </div>

            <div style={{ 
                background: '#fff9eb', 
                border: '1px solid #fee8c8',
                borderRadius: '14px', 
                padding: '1.25rem'
            }}>
                <h3 style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontSize: '0.9rem',
                    color: '#b45309',
                    margin: '0 0 0.5rem 0'
                }}>
                    <CheckSquare size={16} style={{ strokeWidth: 2.5 }} />
                    Active Objective
                </h3>
                <p style={{ 
                    color: '#78350f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem', 
                    margin: 0,
                    lineHeight: '1.5'
                }}>
                    {level.task}
                </p>
            </div>

            {level.sampleOutput && (
                <div style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    <h3 style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontSize: '0.9rem',
                        color: '#475569',
                        margin: 0
                    }}>
                        <Table size={16} style={{ strokeWidth: 2.5 }} />
                        Expected Output Schema & Sample
                    </h3>
                    <p style={{
                        color: '#64748b',
                        fontSize: '0.75rem',
                        margin: 0,
                        lineHeight: '1.4'
                    }}>
                        {level.sampleOutput.columns.length > 0 ? (
                            "Your query must return the columns shown below. The row values are simulated examples."
                        ) : (
                            "This is a database modifying query. No rows will be returned upon success."
                        )}
                    </p>
                    {level.sampleOutput.columns.length > 0 && (
                        <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #e2e8f0', background: '#ffffff' }}>
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                fontSize: '0.75rem',
                                textAlign: 'left'
                            }}>
                                <thead>
                                    <tr style={{ background: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                                        {level.sampleOutput.columns.map((col, idx) => (
                                            <th key={idx} style={{ padding: '0.5rem 0.75rem', fontWeight: 600, color: '#334155' }}>
                                                {col}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {level.sampleOutput.values.map((row, rowIdx) => (
                                        <tr key={rowIdx}>
                                            {row.map((val, valIdx) => (
                                                <td key={valIdx} style={{ padding: '0.5rem 0.75rem', color: '#475569', fontFamily: 'monospace' }}>
                                                    {val === null || val === undefined ? (
                                                        <span style={{ color: '#cbd5e1', fontStyle: 'italic' }}>NULL</span>
                                                    ) : (
                                                        String(val)
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
