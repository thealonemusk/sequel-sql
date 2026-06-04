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

    return (
        <div 
            id="terminal" 
            className="panel editor-container" 
            style={{ 
                height: height ? `${height}px` : 'auto', 
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
                    />
                </div>
            </div>
        </div>
    );
};
