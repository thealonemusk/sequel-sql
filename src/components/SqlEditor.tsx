import { useCallback, useState } from 'react';
import DefaultEditor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css';
import { Play, Terminal } from 'lucide-react';

// react-simple-code-editor ships both CJS and ESM builds; normalise the import
const Editor = (DefaultEditor as { default?: typeof DefaultEditor } & typeof DefaultEditor).default
  ?? DefaultEditor;

// ---------------------------------------------------------------------------
// SqlEditor
// A lightweight SQL editor with syntax highlighting and a Ctrl+/ comment
// toggle shortcut.
// ---------------------------------------------------------------------------

const INITIAL_QUERY = 'SELECT * FROM employees;';

interface SqlEditorProps {
  onRun: (query: string) => void;
  height?: number;
}

export function SqlEditor({ onRun, height }: SqlEditorProps) {
  const [code, setCode] = useState(INITIAL_QUERY);

  const handleRun = useCallback(() => {
    const trimmed = code.trim();
    if (trimmed) onRun(trimmed);
  }, [code, onRun]);

  /** Ctrl+/ — toggle SQL line comments on the selected line(s). */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLElement>) => {
      const textarea = e.target as HTMLTextAreaElement;
      // Run query on Ctrl+Enter / Cmd+Enter
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleRun();
        return;
      }

      // Toggle line comment on Ctrl+/
      if (e.key === '/' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        const { selectionStart: start, selectionEnd: end, value } = textarea;

        const lineStart = value.lastIndexOf('\n', start - 1) + 1;
        const lineEndOffset = value.indexOf('\n', end);
        const lineEnd = lineEndOffset === -1 ? value.length : lineEndOffset;

        const selectedText = value.slice(lineStart, lineEnd);
        const lines = selectedText.split('\n');
        const allCommented = lines.every((l) => /^\s*--/.test(l));

        const toggled = allCommented
          ? lines.map((l) => l.replace(/^(\s*)--\s?/, '$1'))
          : lines.map((l) => l.replace(/^(\s*)(.*)$/, '$1-- $2'));

        const newBlock = toggled.join('\n');
        const updated =
          value.slice(0, lineStart) + newBlock + value.slice(lineEnd);

        setCode(updated);

        const delta = newBlock.length - selectedText.length;
        setTimeout(() => {
          textarea.focus();
          const newPos = start === end ? Math.max(0, start + delta) : start;
          textarea.setSelectionRange(newPos, end + delta);
        }, 0);
      }
    },
    [handleRun],
  );

  const highlight = useCallback(
    (src: string) => Prism.highlight(src, Prism.languages.sql, 'sql'),
    [],
  );

  return (
    <div
      id="terminal"
      className="panel editor-container"
      style={height ? { height: `${height}px` } : undefined}
    >
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="panel-header">
          <div className="panel-icon">
            <Terminal size={18} strokeWidth={2.5} />
          </div>
          <h3 className="panel-title">SQL Terminal</h3>
        </div>
        <button className="btn btn--run" onClick={handleRun} title="Run query (Ctrl+Enter)">
          <Play size={14} fill="currentColor" strokeWidth={3} />
          Run Query
        </button>
      </div>

      {/* macOS-style editor chrome */}
      <div className="mac-editor-wrapper">
        <div className="mac-title-bar">
          <div className="mac-dots" aria-hidden="true">
            <span className="mac-dot mac-dot--red" />
            <span className="mac-dot mac-dot--yellow" />
            <span className="mac-dot mac-dot--green" />
          </div>
          <span className="mac-title">omnicorp_sec_db.sql</span>
          {/* Spacer keeps the title centred */}
          <span aria-hidden="true" style={{ width: 42 }} />
        </div>

        <div className="code-editor">
          <Editor
            value={code}
            onValueChange={setCode}
            highlight={highlight}
            padding={15}
            style={{ flexGrow: 1, fontSize: 14, fontFamily: 'var(--font-mono)', minHeight: '100%' }}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </div>
  );
}
    