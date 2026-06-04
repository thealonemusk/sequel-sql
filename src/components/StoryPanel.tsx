import type { Level } from '../db/levels';
import { Terminal, Database } from 'lucide-react';

interface StoryPanelProps {
    level: Level;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ level }) => {
    return (
        <div className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <img src="/hero-graphic.png" alt="Data Detective" className="story-graphic" />
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Terminal size={20} className="icon-primary" style={{ color: 'var(--primary-color)' }} />
                <h2 style={{ margin: 0 }}>{level.title}</h2>
            </div>
            
            <div style={{ 
                background: '#f8fafc', 
                padding: '1rem', 
                borderRadius: '8px', 
                borderLeft: '4px solid var(--primary-color)' 
            }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                    {level.story}
                </p>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                    <Database size={16} />
                    Current Task
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>
                    {level.task}
                </p>
            </div>
        </div>
    );
};
