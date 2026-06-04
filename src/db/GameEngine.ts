import initSqlJs from 'sql.js';
import type { Database } from 'sql.js';
import sqlWasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { initialSchema, seedData } from './schema';

class GameEngine {
    private db: Database | null = null;
    public isReady: boolean = false;

    async init() {
        if (this.db) return;
        try {
            const SQL = await initSqlJs({
                locateFile: () => sqlWasmUrl
            });
            this.db = new SQL.Database();
            this.db.run(initialSchema);
            this.db.run(seedData);
            this.isReady = true;
        } catch (error) {
            console.error("Failed to initialize sql.js", error);
        }
    }

    executeQuery(query: string) {
        if (!this.db) {
            return { error: "Database not initialized", results: [] };
        }
        try {
            // For statements like UPDATE/INSERT which don't return rows, exec returns []
            // So we can still execute them, but if we want to know if they succeeded we check for error
            const results = this.db.exec(query);
            return { results, error: null };
        } catch (error: any) {
            return { results: [], error: error.message };
        }
    }

    getSchema() {
        if (!this.db) return [];
        try {
            const results = this.db.exec(`
                SELECT m.name as table_name, p.name as column_name, p.type as data_type
                FROM sqlite_master m
                LEFT OUTER JOIN pragma_table_info((m.name)) p
                ON m.name <> p.name
                WHERE m.type = 'table' AND m.name NOT LIKE 'sqlite_%'
                ORDER BY m.name, p.cid
            `);
            return results[0]?.values || [];
        } catch (e) {
            return [];
        }
    }

    reset() {
        if (!this.db) return;
        try {
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
        } catch (error) {
            console.error("Failed to reset database", error);
        }
    }
}

export const gameEngine = new GameEngine();
