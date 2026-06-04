import { useMemo } from 'react';
import { TableProperties } from 'lucide-react';

interface SchemaViewerProps {
    schemaData: any[][];
}

export const SchemaViewer: React.FC<SchemaViewerProps> = ({ schemaData }) => {
    const groupedSchema = useMemo(() => {
        const groups: Record<string, {name: string, type: string}[]> = {};
        schemaData.forEach(row => {
            const [table, col, type] = row;
            if (!groups[table]) groups[table] = [];
            if (col) {
                groups[table].push({ name: col, type });
            }
        });
        return groups;
    }, [schemaData]);

    return (
        <div className="panel" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <TableProperties size={18} />
                Database Schema
            </h3>
            
            {Object.keys(groupedSchema).length === 0 && (
                <p style={{ fontSize: '0.9rem' }}>No tables available.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {Object.entries(groupedSchema).map(([table, cols]) => (
                    <div key={table} className="schema-table">
                        <div className="schema-table-name">{table}</div>
                        <div className="schema-columns">
                            {cols.map(c => (
                                <span key={c.name} className="schema-column">
                                    {c.name} <span style={{ opacity: 0.6, fontSize: '0.7rem' }}>{c.type}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
