import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { initialSchema, seedData } from './schema';
import type { QueryResult, SchemaRow } from '../types';

// ---------------------------------------------------------------------------
// GameEngine
// Wraps the sql.js in-memory SQLite database.  The singleton `gameEngine`
// export is the single point of contact for all database operations.
// ---------------------------------------------------------------------------

class GameEngine {
  private db: Database | null = null;
  private _isReady = false;

  get isReady(): boolean {
    return this._isReady;
  }

  /** Initialise the in-memory database and seed it with game data.
   *  Safe to call multiple times — subsequent calls are no-ops. */
  async init(): Promise<void> {
    if (this.db) return;

    const SQL = await initSqlJs({ locateFile: () => sqlWasmUrl });
    this.db = new SQL.Database();
    this.db.run(initialSchema);
    this.db.run(seedData);
    this._isReady = true;
  }

  /** Execute an arbitrary SQL string and return the result rows.
   *  DML statements (INSERT / UPDATE / DELETE) return an empty array. */
  executeQuery(query: string): { results: QueryResult[]; error: string | null } {
    if (!this.db) {
      return { results: [], error: 'Database not initialised.' };
    }

    try {
      const raw = this.db.exec(query);
      // sql.js returns SqlJs.QueryExecResult[] — cast to our lighter type
      const results: QueryResult[] = raw.map((r) => ({
        columns: r.columns,
        values: r.values as QueryResult['values'],
      }));
      return { results, error: null };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { results: [], error: message };
    }
  }

  /** Return the live schema as flat rows: [tableName, columnName, dataType]. */
  getSchema(): SchemaRow[] {
    if (!this.db) return [];

    try {
      const raw = this.db.exec(`
        SELECT m.name  AS table_name,
               p.name  AS column_name,
               p.type  AS data_type
        FROM   sqlite_master m
        LEFT OUTER JOIN pragma_table_info((m.name)) p
          ON  m.name <> p.name
        WHERE  m.type = 'table'
          AND  m.name NOT LIKE 'sqlite_%'
        ORDER  BY m.name, p.cid
      `);
      return (raw[0]?.values ?? []) as SchemaRow[];
    } catch {
      return [];
    }
  }

  /** Drop all tables and re-seed the database to its original state. */
  reset(): void {
    if (!this.db) return;

    this.db.run(`
      DROP TABLE IF EXISTS blacklisted_ips;
      DROP TABLE IF EXISTS transfer_logs;
      DROP TABLE IF EXISTS offshore_accounts;
      DROP TABLE IF EXISTS departments;
      DROP TABLE IF EXISTS access_logs;
      DROP TABLE IF EXISTS transactions;
      DROP TABLE IF EXISTS employees;
    `);
    this.db.run(initialSchema);
    this.db.run(seedData);
  }
}

/** Application-wide singleton. */
export const gameEngine = new GameEngine();
