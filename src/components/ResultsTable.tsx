import type { QueryResult } from '../db/levels';
import { Table, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ResultsTableProps {
    results: QueryResult[];
    error: string | null;
    successMessage: string | null;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({ results, error, successMessage }) => {
    return (
        <div className="panel results-container">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Table size={20} /> Query Results
            </h3>

            {error && (
                <div className="alert error">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            {successMessage && (
                <div className="alert success">
                    <CheckCircle2 size={20} />
                    <span>{successMessage}</span>
                </div>
            )}

            {!error && results.length === 0 && !successMessage && (
                <p style={{ textAlign: 'center', marginTop: '2rem' }}>Run a query to see results.</p>
            )}

            {results.map((res, i) => (
                <div key={i} style={{ overflowX: 'auto', border: '1px solid var(--surface-border)', borderRadius: '8px' }}>
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
