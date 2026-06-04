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
        <div id="schema" className="panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ 
                    background: 'var(--primary-light)', 
                    padding: '0.5rem', 
                    borderRadius: '10px', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'var(--primary-color)'
                }}>
                    <TableProperties size={18} style={{ strokeWidth: 2.5 }} />
                </div>
                <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Database Schema</h3>
            </div>
            
            {Object.keys(groupedSchema).length === 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No tables available.</p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {Object.entries(groupedSchema).map(([table, cols]) => (
                    <div key={table} className="schema-table">
                        <div className="schema-table-name">{table}</div>
                        <div className="schema-columns">
                            {cols.map(c => (
                                <span key={c.name} className="schema-column">
                                    {c.name}
                                    <span className="schema-column-type">{c.type}</span>
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
