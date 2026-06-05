// ---------------------------------------------------------------------------
// Shared domain types
// ---------------------------------------------------------------------------

/** A single result set returned by sql.js `exec()`. */
export interface QueryResult {
  columns: string[];
  values: CellValue[][];
}

/** Any primitive value that can appear in a SQL result cell. */
export type CellValue = string | number | null;

/** A flattened schema row: [tableName, columnName, dataType]. */
export type SchemaRow = [string, string, string];

/** Grouped schema representation used by SchemaViewer. */
export type GroupedSchema = Record<string, Array<{ name: string; type: string }>>;

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface ValidationResult {
  success: boolean;
  message: string;
}

// ---------------------------------------------------------------------------
// Game / Level
// ---------------------------------------------------------------------------

export interface SampleOutput {
  columns: string[];
  values: CellValue[][];
}

export interface Level {
  id: number;
  title: string;
  story: string;
  task: string;
  /** A correct SQL answer revealed when the user requests a hint. */
  answer: string;
  validator: (results: QueryResult[], query: string) => ValidationResult;
  sampleOutput?: SampleOutput;
}
