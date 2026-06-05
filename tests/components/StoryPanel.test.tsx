import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StoryPanel } from '../../src/components/StoryPanel';
import type { Level } from '../../src/db/levels';

describe('StoryPanel Component', () => {
    const mockLevel: Level = {
        id: 1,
        title: 'Test Level Title',
        story: 'This is a test story describing the narrative.',
        task: 'Test task instructions go here.',
        validator: () => ({ success: true, message: 'Valid' })
    };

    it('should render the level title, story, and task', () => {
        render(<StoryPanel level={mockLevel} />);
        
        expect(screen.getByText('Test Level Title')).toBeInTheDocument();
        expect(screen.getByText('This is a test story describing the narrative.')).toBeInTheDocument();
        expect(screen.getByText('Test task instructions go here.')).toBeInTheDocument();
    });

    it('should render the hero graphic', () => {
        render(<StoryPanel level={mockLevel} />);
        const image = screen.getByRole('img', { name: /data detective/i });
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', '/hero-graphic.png');
    });
});
