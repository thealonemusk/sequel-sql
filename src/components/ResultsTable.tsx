import { useState } from 'react';
import { AlertCircle, CheckCircle2, Eye, EyeOff, Table } from 'lucide-react';
import type { QueryResult } from '../types';

// ---------------------------------------------------------------------------
// ResultsTable
// Displays query results, validation feedback, and an optional answer hint.
// ---------------------------------------------------------------------------

interface ResultsTableProps {
  results: QueryResult[];
  error: string | null;
  successMessage: string | null;
  answer?: string;
  onNext?: () => void;
  onReset?: () => void;
  isLastLevel?: boolean;
}

export function ResultsTable({
  results,
  error,
  successMessage,
  answer,
  onNext,
  onReset,
  isLastLevel,
}: ResultsTableProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  const isEmpty = !error && results.length === 0 && !successMessage;

  return (
    <div className="panel results-container">
      {/* Panel header */}
      <div className="panel-header results-header">
        <div className="panel-icon">
          <Table size={18} strokeWidth={2.5} />
        </div>
        <h3 className="panel-title">Query Results</h3>
      </div>

      {/* ── Error / Hint ──────────────────────────────────────────────── */}
      {error && (
        <div className="results-feedback">
          <div className="alert alert--error">
            <AlertCircle size={16} strokeWidth={2.5} className="alert__icon" />
            <span>{error}</span>
          </div>

          {answer && (
            <div className="hint-block">
              <button
                className="hint-toggle-btn"
                onClick={() => setShowAnswer((v) => !v)}
                aria-expanded={showAnswer}
              >
                {showAnswer ? (
                  <>
                    <EyeOff size={13} strokeWidth={2.5} />
                    Hide Answer
                  </>
                ) : (
                  <>
                    <Eye size={13} strokeWidth={2.5} />
                    Show Answer
                  </>
                )}
              </button>

              {showAnswer && (
                <pre className="hint-code" aria-label="Sample answer">
                  {answer}
                </pre>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Success ───────────────────────────────────────────────────── */}
      {successMessage && (
        <div className="results-success-row">
          <div className="alert alert--success">
            <CheckCircle2 size={16} strokeWidth={2.5} className="alert__icon" />
            <span>{successMessage}</span>
          </div>

          {isLastLevel ? (
            <button className="btn btn--primary" onClick={onReset}>
              Reset &amp; Play Again
            </button>
          ) : (
            <button className="btn btn--primary" onClick={onNext}>
              Continue →
            </button>
          )}
        </div>
      )}

      {/* ── Empty state ───────────────────────────────────────────────── */}
      {isEmpty && (
        <div className="results-empty" aria-live="polite">
          <div className="results-empty__icon">
            <Table size={22} strokeWidth={2} />
          </div>
          <h4 className="results-empty__title">Terminal Ready</h4>
          <p className="results-empty__hint">
            Run a SELECT, JOIN, or UPDATE query to inspect database records.
          </p>
        </div>
      )}

      {/* ── Result tables ─────────────────────────────────────────────── */}
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
                    <td key={cIdx}>
                      {val !== null ? String(val) : <span className="null-value">NULL</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
