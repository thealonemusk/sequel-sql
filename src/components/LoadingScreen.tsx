// ---------------------------------------------------------------------------
// LoadingScreen
// Shown while the sql.js WASM bundle is loading and the DB is being seeded.
// ---------------------------------------------------------------------------

export function LoadingScreen() {
  return (
    <div className="loading-screen" role="status" aria-live="polite">
      <div className="loading-card">
        <div className="loading-spinner" aria-hidden="true" />
        <h2 className="loading-title">Initializing Database…</h2>
        <p className="loading-subtitle">Setting up detective terminal workspace.</p>
      </div>
    </div>
  );
}
