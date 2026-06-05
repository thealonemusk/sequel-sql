import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ResultsTable } from '../../src/components/ResultsTable';

describe('ResultsTable Component', () => {
    it('should render the default empty state', () => {
        render(<ResultsTable results={[]} error={null} successMessage={null} />);
        expect(screen.getByText('Query Results')).toBeInTheDocument();
        expect(screen.getByText('Run a query to see results.')).toBeInTheDocument();
    });

    it('should display an error message when error prop is provided', () => {
        render(<ResultsTable results={[]} error="Syntax error near SELECT" successMessage={null} />);
        expect(screen.getByText('Syntax error near SELECT')).toBeInTheDocument();
        expect(screen.queryByText('Run a query to see results.')).not.toBeInTheDocument();
    });

    it('should display a success message when successMessage prop is provided', () => {
        render(<ResultsTable results={[]} error={null} successMessage="Level completed!" />);
        expect(screen.getByText('Level completed!')).toBeInTheDocument();
    });

    it('should render a table of results', () => {
        const mockResults = [{
            columns: ['id', 'name'],
            values: [[1, 'Alice'], [2, 'Bob']]
        }];
        
        render(<ResultsTable results={mockResults} error={null} successMessage={null} />);
        
        // Headers
        expect(screen.getByText('id')).toBeInTheDocument();
        expect(screen.getByText('name')).toBeInTheDocument();
        
        // Data values
        expect(screen.getByText('1')).toBeInTheDocument();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('should render NULL string for null values', () => {
        const mockResults = [{
            columns: ['id', 'data'],
            values: [[1, null]]
        }];
        
        render(<ResultsTable results={mockResults} error={null} successMessage={null} />);
        expect(screen.getByText('NULL')).toBeInTheDocument();
    });
});
