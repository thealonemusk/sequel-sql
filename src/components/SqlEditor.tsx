import { useState } from 'react';
import DefaultEditor from 'react-simple-code-editor';
const Editor = (DefaultEditor as any).default || DefaultEditor;
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css'; // Light theme
import { Play, Terminal } from 'lucide-react';

interface SqlEditorProps {
    onRun: (query: string) => void;
    height?: number;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({ onRun, height }) => {
    const [code, setCode] = useState('SELECT * FROM employees;');

    const handleRun = () => {
        if (code.trim()) {
            onRun(code);
        }
    };

    // keydown handler for Ctrl + /
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((e.key === '/' || e.code === 'Slash') && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            const textarea = e.currentTarget;
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const value = textarea.value;

            const beforeSelection = value.substring(0, start);
            const lineStartIdx = beforeSelection.lastIndexOf('\n') + 1;

            const afterSelection = value.substring(end);
            const nextNewLine = afterSelection.indexOf('\n');
            const lineEndIdx = nextNewLine === -1 ? value.length : end + nextNewLine;

            const selectedLinesText = value.substring(lineStartIdx, lineEndIdx);
            const lines = selectedLinesText.split('\n');

            const allCommented = lines.every(line => /^\s*--/.test(line));

            let newLines: string[];
            if (allCommented) {
                newLines = lines.map(line => {
                    const match = line.match(/^(\s*)--\s?(.*)$/);
                    if (match) {
                        return match[1] + match[2];
                    }
                    return line;
                });
            } else {
                newLines = lines.map(line => {
                    const match = line.match(/^(\s*)(.*)$/);
                    if (match) {
                        return match[1] + '-- ' + match[2];
                    }
                    return '-- ' + line;
                });
            }

            const newText = newLines.join('\n');
            const updatedValue = value.substring(0, lineStartIdx) + newText + value.substring(lineEndIdx);

            setCode(updatedValue);

            const lengthDiff = newText.length - selectedLinesText.length;
            setTimeout(() => {
                textarea.focus();
                if (start === end) {
                    const newPos = Math.max(0, start + lengthDiff);
                    textarea.setSelectionRange(newPos, newPos);
                } else {
                    textarea.setSelectionRange(start, end + lengthDiff);
                }
            }, 0);
        }
    };

    return (
        <div 
            id="terminal" 
            className="panel editor-container" 
            style={{ 
                height: height ? `${height}px` : '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                boxSizing: 'border-box'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
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
                    <h3 style={{ margin: 0, fontSize: '1.05rem' }}>SQL Terminal</h3>
                </div>
                <button className="btn" onClick={handleRun}>
                    <Play size={14} fill="currentColor" style={{ strokeWidth: 3 }} /> Run Query
                </button>
            </div>
            
            <div className="mac-editor-wrapper">
                <div className="mac-title-bar">
                    <div className="mac-dots">
                        <span className="mac-dot red"></span>
                        <span className="mac-dot yellow"></span>
                        <span className="mac-dot green"></span>
                    </div>
                    <div className="mac-title">omnicorp_sec_db.sql</div>
                    <div style={{ width: '42px' }}></div> {/* spacer to center title */}
                </div>
                <div className="code-editor">
                    <Editor
                        value={code}
                        onValueChange={setCode}
                        highlight={(code: string) => Prism.highlight(code, Prism.languages.sql, 'sql')}
                        padding={15}
                        style={{
                            flexGrow: 1,
                            fontSize: 14,
                            fontFamily: 'var(--font-mono)',
                            minHeight: '100%'
                        }}
                        onKeyDown={handleKeyDown}
                    />
                </div>
            </div>
        </div>
    );
};
