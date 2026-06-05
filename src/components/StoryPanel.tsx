import { CheckSquare, Table, Terminal } from 'lucide-react';
import type { Level } from '../types';

// ---------------------------------------------------------------------------
// StoryPanel
// Displays the narrative context, active objective, and expected output schema
// for the current level.
// ---------------------------------------------------------------------------

interface StoryPanelProps {
  level: Level;
}

export function StoryPanel({ level }: StoryPanelProps) {
  const hasSampleColumns = (level.sampleOutput?.columns.length ?? 0) > 0;

  return (
    <div id="story" className="panel story-panel">
      {/* Level title */}
      <div className="panel-header">
        <div className="panel-icon">
          <Terminal size={18} strokeWidth={2.5} />
        </div>
        <h2 className="story-title">{level.title}</h2>
      </div>

      {/* Narrative */}
      <div className="story-narrative">
        <p className="story-narrative__text">{level.story}</p>
      </div>

      {/* Objective */}
      <div className="story-objective">
        <h3 className="story-objective__heading">
          <CheckSquare size={16} strokeWidth={2.5} />
          Active Objective
        </h3>
        <p className="story-objective__text">{level.task}</p>
      </div>

      {/* Expected output */}
      {level.sampleOutput && (
        <div className="story-sample">
          <h3 className="story-sample__heading">
            <Table size={16} strokeWidth={2.5} />
            Expected Output Schema &amp; Sample
          </h3>
          <p className="story-sample__hint">
            {hasSampleColumns
              ? 'Your query must return the columns shown below. Row values are simulated examples.'
              : 'This is a database-modifying query. No rows will be returned upon success.'}
          </p>

          {hasSampleColumns && (
            <div className="story-sample__table-wrapper">
              <table className="story-sample__table">
                <thead>
                  <tr>
                    {level.sampleOutput!.columns.map((col, idx) => (
                      <th key={idx}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {level.sampleOutput!.values.map((row, rowIdx) => (
                    <tr key={rowIdx}>
                      {row.map((val, valIdx) => (
                        <td key={valIdx}>
                          {val === null || val === undefined ? (
                            <span className="null-value">NULL</span>
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
}
