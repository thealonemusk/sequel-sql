import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SqlEditor } from '../../src/components/SqlEditor';

describe('SqlEditor Component', () => {
    it('should render the terminal title and run button', () => {
        render(<SqlEditor onRun={() => {}} />);
        expect(screen.getByText('SQL Terminal')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /run query/i })).toBeInTheDocument();
    });

    it('should call onRun when the button is clicked with the current code', () => {
        const handleRun = vi.fn();
        render(<SqlEditor onRun={handleRun} />);
        
        const button = screen.getByRole('button', { name: /run query/i });
        fireEvent.click(button);
        
        // Initial state is 'SELECT * FROM employees;'
        expect(handleRun).toHaveBeenCalledWith('SELECT * FROM employees;');
        expect(handleRun).toHaveBeenCalledTimes(1);
    });
});
