import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SchemaViewer } from '../../src/components/SchemaViewer';

describe('SchemaViewer Component', () => {
    it('should render empty state when no schema data is provided', () => {
        render(<SchemaViewer schemaData={[]} />);
        expect(screen.getByText('Database Schema')).toBeInTheDocument();
        expect(screen.getByText('No tables available.')).toBeInTheDocument();
    });

    it('should group columns by table name', () => {
        const mockSchema = [
            ['employees', 'id', 'INTEGER'],
            ['employees', 'name', 'TEXT'],
            ['transactions', 'amount', 'DECIMAL']
        ];
        
        render(<SchemaViewer schemaData={mockSchema} />);
        
        // Check tables
        expect(screen.getByText('employees')).toBeInTheDocument();
        expect(screen.getByText('transactions')).toBeInTheDocument();
        
        // Check columns
        expect(screen.getByText('id')).toBeInTheDocument();
        expect(screen.getByText('name')).toBeInTheDocument();
        expect(screen.getByText('amount')).toBeInTheDocument();
        
        // Check types
        expect(screen.getByText('INTEGER')).toBeInTheDocument();
        expect(screen.getByText('TEXT')).toBeInTheDocument();
        expect(screen.getByText('DECIMAL')).toBeInTheDocument();
    });
});
