import type { Level } from '../db/levels';
import { Terminal, CheckSquare } from 'lucide-react';

interface StoryPanelProps {
    level: Level;
}

export const StoryPanel: React.FC<StoryPanelProps> = ({ level }) => {
    return (
        <div id="story" className="panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                <h2 style={{ fontSize: '1.2rem', margin: 0 }}>{level.title}</h2>
            </div>
            
            <div style={{ 
                background: 'rgba(99, 102, 241, 0.03)', 
                padding: '1.25rem', 
                borderRadius: '14px', 
                borderLeft: '4px solid var(--primary-color)',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.01)'
            }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6', fontWeight: 500 }}>
                    {level.story}
                </p>
            </div>

            <div style={{ 
                background: '#fff9eb', 
                border: '1px solid #fee8c8',
                borderRadius: '14px', 
                padding: '1.25rem'
            }}>
                <h3 style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    fontSize: '0.9rem',
                    color: '#b45309',
                    margin: '0 0 0.5rem 0'
                }}>
                    <CheckSquare size={16} style={{ strokeWidth: 2.5 }} />
                    Active Objective
                </h3>
                <p style={{ 
                    color: '#78350f', 
                    fontWeight: 600, 
                    fontSize: '0.875rem', 
                    margin: 0,
                    lineHeight: '1.5'
                }}>
                    {level.task}
                </p>
            </div>
        </div>
    );
};
