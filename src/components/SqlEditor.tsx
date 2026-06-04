import { useState } from 'react';
import DefaultEditor from 'react-simple-code-editor';
const Editor = (DefaultEditor as any).default || DefaultEditor;
import Prism from 'prismjs';
import 'prismjs/components/prism-sql';
import 'prismjs/themes/prism.css'; // Light theme
import { Play } from 'lucide-react';

interface SqlEditorProps {
    onRun: (query: string) => void;
}

export const SqlEditor: React.FC<SqlEditorProps> = ({ onRun }) => {
    const [code, setCode] = useState('SELECT * FROM employees;');

    const handleRun = () => {
        if (code.trim()) {
            onRun(code);
        }
    };

    return (
        <div className="panel editor-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>SQL Terminal</h3>
                <button className="btn" onClick={handleRun}>
                    <Play size={16} fill="white" /> Run Query
                </button>
            </div>
            <div className="code-editor">
                <Editor
                    value={code}
                    onValueChange={setCode}
                    highlight={code => Prism.highlight(code, Prism.languages.sql, 'sql')}
                    padding={15}
                    style={{
                        minHeight: '150px',
                        fontSize: 14,
                    }}
                />
            </div>
        </div>
    );
};
