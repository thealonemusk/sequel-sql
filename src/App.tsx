import { useEffect, useState } from 'react';
import { gameEngine } from './db/GameEngine';
import { levels } from './db/levels';
import type { QueryResult } from './db/levels';
import { StoryPanel } from './components/StoryPanel';
import { SchemaViewer } from './components/SchemaViewer';
import { SqlEditor } from './components/SqlEditor';
import { ResultsTable } from './components/ResultsTable';
import { Briefcase } from 'lucide-react';

function App() {
    const [isReady, setIsReady] = useState(false);
    const [currentLevelId, setCurrentLevelId] = useState(1);
    const [schema, setSchema] = useState<any[][]>([]);
    
    const [results, setResults] = useState<QueryResult[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const currentLevel = levels.find(l => l.id === currentLevelId);

    useEffect(() => {
        gameEngine.init().then(() => {
            setIsReady(true);
            setSchema(gameEngine.getSchema());
        });
    }, []);

    const handleRunQuery = (query: string) => {
        if (!isReady || !currentLevel) return;

        setError(null);
        setSuccessMsg(null);
        setResults([]);

        const { results: queryResults, error: queryError } = gameEngine.executeQuery(query);
        
        if (queryError) {
            setError(queryError);
            return;
        }

        setResults(queryResults);
        
        // After every query, update schema in case they ran CREATE/ALTER
        setSchema(gameEngine.getSchema());

        // Validate logic
        const validation = currentLevel.validator(queryResults, query);
        if (validation.success) {
            setSuccessMsg(validation.message);
            // Optionally, wait a bit and advance level
            setTimeout(() => {
                if (currentLevelId < levels.length) {
                    setCurrentLevelId(prev => prev + 1);
                    setSuccessMsg(null);
                    setResults([]);
                } else {
                    setSuccessMsg("Congratulations! You have completed all levels of Data Detective!");
                }
            }, 3000);
        } else {
            setError(validation.message);
        }
    };

    if (!isReady) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc', color: '#0f172a' }}>
                <h2>Initializing Database...</h2>
            </div>
        );
    }

    if (!currentLevel) return null;

    return (
        <div className="layout-grid">
            <header className="header">
                <div className="header-title-wrapper">
                    <Briefcase size={24} color="var(--primary-color)" />
                    <h1>SQL Detective: The Corporate Heist</h1>
                </div>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Level {currentLevel.id} / {levels.length}
                </div>
            </header>

            <aside className="sidebar">
                <StoryPanel level={currentLevel} />
                <SchemaViewer schemaData={schema} />
            </aside>

            <main className="main-content">
                <SqlEditor onRun={handleRunQuery} />
                <ResultsTable results={results} error={error} successMessage={successMsg} />
            </main>
        </div>
    );
}

export default App;
