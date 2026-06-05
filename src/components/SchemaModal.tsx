import { useEffect } from 'react';
import { X } from 'lucide-react';
import { SchemaViewer } from './SchemaViewer';
import type { SchemaRow } from '../types';

// ---------------------------------------------------------------------------
// SchemaModal
// Accessible modal overlay that displays the live database schema.
// ---------------------------------------------------------------------------

interface SchemaModalProps {
  schema: SchemaRow[];
  onClose: () => void;
}

export function SchemaModal({ schema, onClose }: SchemaModalProps) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Database Schema"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close schema modal"
        >
          <X size={16} strokeWidth={2.5} />
        </button>
        <div className="modal-body">
          <SchemaViewer schemaData={schema} />
        </div>
      </div>
    </div>
  );
}
