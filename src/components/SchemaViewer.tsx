import { useMemo } from 'react';
import { TableProperties } from 'lucide-react';
import type { GroupedSchema, SchemaRow } from '../types';

// ---------------------------------------------------------------------------
// SchemaViewer
// Renders a grouped, searchable view of all tables and their columns.
// ---------------------------------------------------------------------------

interface SchemaViewerProps {
  schemaData: SchemaRow[];
}

export function SchemaViewer({ schemaData }: SchemaViewerProps) {
  const groupedSchema = useMemo<GroupedSchema>(() => {
    return schemaData.reduce<GroupedSchema>((acc, [table, col, type]) => {
      if (!acc[table]) acc[table] = [];
      if (col) acc[table].push({ name: col, type });
      return acc;
    }, {});
  }, [schemaData]);

  const tableNames = Object.keys(groupedSchema);

  return (
    <div id="schema" className="panel">
      <div className="panel-header">
        <div className="panel-icon">
          <TableProperties size={18} strokeWidth={2.5} />
        </div>
        <h3 className="panel-title">Database Schema</h3>
      </div>

      {tableNames.length === 0 ? (
        <p className="text-muted">No tables available.</p>
      ) : (
        <div className="schema-list">
          {tableNames.map((table) => (
            <div key={table} className="schema-table">
              <div className="schema-table-name">{table}</div>
              <div className="schema-columns">
                {groupedSchema[table].map((col) => (
                  <span key={col.name} className="schema-column">
                    {col.name}
                    <span className="schema-column-type">{col.type}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
