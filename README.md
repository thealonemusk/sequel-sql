# SQL Detective

A story-driven SQL learning game built entirely in the browser. You play as a data analyst at OmniCorp investigating a financial crime — and every clue requires writing real SQL to uncover.

No backend. No sign-up. Just SQL.

---

## Overview

SQL Detective runs a full SQLite database in-browser via [sql.js](https://sql.js.org) (WebAssembly). Every query you write executes against a live, in-memory database seeded with realistic corporate data. Progress through 50 levels that cover everything from basic `SELECT` to window functions, CTEs, and multi-table joins.

The database resets between game sessions and can be reset at any time from the header.

---

## Features

- **50 progressive levels** covering the full SQL curriculum
- **Live in-browser SQLite** — no server required, runs entirely in WebAssembly
- **Syntax-highlighted editor** with Ctrl+Enter to run and Ctrl+/ to toggle comments
- **Show Answer** hint revealed on demand when a query fails
- **Resizable panels** — drag to split the story panel and terminal to any proportion
- **Live schema viewer** — inspect all 7 tables and their columns at any time
- **Story-driven narrative** that ties each SQL concept to the investigation

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite |
| Database | sql.js 1.14 (SQLite via WASM) |
| Editor | react-simple-code-editor + PrismJS |
| Icons | Lucide React |
| Tests | Vitest + Testing Library |

---

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).

```bash
# Type-check + production build
npm run build

# Preview the production build locally
npm run preview

# Run tests (single pass)
npm test

# Run tests in watch mode
npm run test:watch

# Lint
npm run lint
```

---

## Project Structure

```
src/
├── types/
│   └── index.ts          # Shared domain types (QueryResult, Level, SchemaRow…)
├── db/
│   ├── GameEngine.ts     # sql.js wrapper — init, execute, schema, reset
│   ├── levels.ts         # All 50 level definitions (story, task, validator, answer)
│   └── schema.ts         # CREATE TABLE statements + seed INSERT data
├── hooks/
│   ├── useGameEngine.ts  # DB state, query execution, feedback
│   └── useResizablePanels.ts  # Horizontal + vertical drag-resize logic
├── components/
│   ├── LoadingScreen.tsx # Shown while WASM initialises
│   ├── SchemaModal.tsx   # Accessible modal wrapping SchemaViewer
│   ├── SchemaViewer.tsx  # Grouped table/column display
│   ├── SqlEditor.tsx     # Code editor with syntax highlight + shortcuts
│   ├── StoryPanel.tsx    # Level narrative, objective, sample output
│   └── ResultsTable.tsx  # Query results + error/success feedback + hint
├── App.tsx               # Root composition — layout, routing between levels
├── main.tsx              # React entry point
└── index.css             # Design tokens + all component styles

testsfolder/
├── setup.ts
└── components/           # Component unit tests
```

---

## The Database

Seven tables are seeded at startup and persist for the entire session:

| Table | Purpose |
|---|---|
| `employees` | 6 staff members with departments, roles, salaries, and manager relationships |
| `transactions` | 11 financial transactions linked to employees |
| `access_logs` | 10 server login events with timestamps and IP addresses |
| `departments` | 5 departments with budgets and office locations |
| `offshore_accounts` | 3 offshore bank accounts |
| `transfer_logs` | Links transactions to offshore accounts with routing info |
| `blacklisted_ips` | 2 known malicious IP addresses |

---

## Level Curriculum

| Levels | Concepts |
|---|---|
| 1–5 | SELECT, WHERE, JOIN basics |
| 6–10 | UPDATE, INSERT, DELETE, GROUP BY, LIKE |
| 11–20 | Aggregates (SUM, COUNT, AVG, MAX), ORDER BY, LIMIT, DISTINCT |
| 21–30 | Multi-table JOINs, BETWEEN, date filtering, self-joins |
| 31–39 | Subqueries (IN, NOT IN, EXISTS), UNION, INTERSECT, EXCEPT |
| 40–46 | Four-table JOINs, CASE, window functions, CTEs |
| 47–50 | DML operations + correlated subqueries |

---

## Adding a Level

Each level is a plain object in `src/db/levels.ts`:

```ts
{
  id: 51,
  title: "Level 51: Example",
  story: "Narrative context...",
  task: "What the user must write.",
  answer: "SELECT * FROM employees;",
  sampleOutput: {
    columns: ["id", "name"],
    values: [[1, "Alice Smith"]],
  },
  validator: (results, query) => {
    if (results.length === 0) return { success: false, message: "No results." };
    // check results and return { success: true/false, message: "..." }
    return { success: true, message: "Well done!" };
  },
}
```

The `validator` receives the raw sql.js result array and the query string. DML queries (INSERT / UPDATE / DELETE) return an empty array — check the query string directly for those levels.

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + Enter` | Run query |
| `Ctrl + /` | Toggle line comment |

---

## License

MIT
