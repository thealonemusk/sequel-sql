import { useCallback, useEffect, useState } from 'react';
import { gameEngine } from '../db/GameEngine';
import type { QueryResult, SchemaRow } from '../types';

// ---------------------------------------------------------------------------
// useGameEngine
// Manages database initialisation, query execution, and schema state.
// ---------------------------------------------------------------------------

interface GameEngineState {
  isReady: boolean;
  schema: SchemaRow[];
  results: QueryResult[];
  error: string | null;
  successMessage: string | null;
}

interface GameEngineActions {
  runQuery: (query: string, validator: (r: QueryResult[], q: string) => { success: boolean; message: string }) => void;
  resetDatabase: () => void;
  clearFeedback: () => void;
}

export function useGameEngine(): GameEngineState & GameEngineActions {
  const [isReady, setIsReady] = useState(false);
  const [schema, setSchema] = useState<SchemaRow[]>([]);
  const [results, setResults] = useState<QueryResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Initialise on mount
  useEffect(() => {
    gameEngine.init().then(() => {
      setIsReady(true);
      setSchema(gameEngine.getSchema());
    });
  }, []);

  const clearFeedback = useCallback(() => {
    setError(null);
    setSuccessMessage(null);
    setResults([]);
  }, []);

  const runQuery = useCallback(
    (
      query: string,
      validator: (r: QueryResult[], q: string) => { success: boolean; message: string },
    ) => {
      clearFeedback();

      const { results: queryResults, error: queryError } = gameEngine.executeQuery(query);

      if (queryError) {
        setError(queryError);
        return;
      }

      setResults(queryResults);
      // Refresh schema after any DDL / DML statement
      setSchema(gameEngine.getSchema());

      const validation = validator(queryResults, query);
      if (validation.success) {
        setSuccessMessage(validation.message);
      } else {
        setError(validation.message);
      }
    },
    [clearFeedback],
  );

  const resetDatabase = useCallback(() => {
    gameEngine.reset();
    setSchema(gameEngine.getSchema());
    clearFeedback();
  }, [clearFeedback]);

  return {
    isReady,
    schema,
    results,
    error,
    successMessage,
    runQuery,
    resetDatabase,
    clearFeedback,
  };
}
