import { useState } from 'react';
import { ArrowRight, Database, FileSearch, ShieldAlert, Zap } from 'lucide-react';

// ---------------------------------------------------------------------------
// LandingPage
// Cinematic dark intro screen. Calls onStart() when the user clicks
// "Begin Investigation", which triggers DB initialisation in the parent.
// ---------------------------------------------------------------------------

interface LandingPageProps {
  onStart: () => void;
}

const FEATURES = [
  {
    icon: <Database size={20} strokeWidth={2} />,
    title: 'Live SQLite Database',
    desc: 'Every query runs against a real in-browser database — no mocks, no shortcuts.',
  },
  {
    icon: <FileSearch size={20} strokeWidth={2} />,
    title: '50 Progressive Levels',
    desc: 'From basic SELECT to CTEs and window functions, all tied to a corporate crime story.',
  },
  {
    icon: <ShieldAlert size={20} strokeWidth={2} />,
    title: 'Story-Driven Missions',
    desc: 'Follow the money at OmniCorp. Each query you write uncovers the next lead.',
  },
  {
    icon: <Zap size={20} strokeWidth={2} />,
    title: 'Instant Feedback',
    desc: 'Wrong answer? Get a hint. Stuck? Reveal the solution and keep moving.',
  },
] as const;

const SQL_LINES = [
  { prompt: '>', sql: 'SELECT name, department FROM employees', delay: 0 },
  { prompt: '>', sql: 'WHERE salary > 80000;', delay: 0.15 },
  { prompt: '↳', sql: '4 rows — Alice Smith, Eve Davis…', delay: 0.3, muted: true },
  { prompt: '>', sql: 'SELECT SUM(amount) FROM transactions', delay: 0.5 },
  { prompt: '>', sql: "WHERE description LIKE '%Offshore%';", delay: 0.65 },
  { prompt: '↳', sql: '95,000.00 — suspicious.', delay: 0.8, muted: true },
] as const;

export function LandingPage({ onStart }: LandingPageProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div className="landing-root">
      {/* ── Ambient background glows ──────────────────────────────────────── */}
      <div className="landing-glow landing-glow--purple" aria-hidden="true" />
      <div className="landing-glow landing-glow--cyan"   aria-hidden="true" />

      {/* ── Nav bar ───────────────────────────────────────────────────────── */}
      <nav className="landing-nav">
        <div className="landing-nav__brand">
          <div className="landing-nav__dot" aria-hidden="true" />
          <span className="landing-nav__name">SQL Detective</span>
        </div>
        <span className="landing-nav__tag">50 Levels · No Sign-up · Runs in Browser</span>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="landing-hero">
        <div className="landing-hero__kicker">
          <span className="landing-kicker-dot" aria-hidden="true" />
          OmniCorp Security Audit — Case #2341
        </div>

        <h1 className="landing-hero__headline">
          Solve a corporate<br />
          <span className="landing-hero__headline--accent">crime with SQL.</span>
        </h1>

        <p className="landing-hero__sub">
          Money is missing. Logins are suspicious. Someone is wiring funds offshore
          at 3&nbsp;AM. Your only tool is SQL — and the truth is hiding in the data.
        </p>

        <button
          className="landing-cta"
          onClick={onStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Begin the investigation"
        >
          Begin Investigation
          <ArrowRight
            size={18}
            strokeWidth={2.5}
            className={`landing-cta__arrow${hovered ? ' landing-cta__arrow--moved' : ''}`}
          />
        </button>

        <p className="landing-hero__note">
          No account required &middot; Runs entirely in your browser
        </p>
      </section>

      {/* ── Terminal preview ──────────────────────────────────────────────── */}
      <section className="landing-terminal-wrap" aria-hidden="true">
        <div className="landing-terminal">
          <div className="landing-terminal__bar">
            <span className="mac-dot mac-dot--red"    />
            <span className="mac-dot mac-dot--yellow" />
            <span className="mac-dot mac-dot--green"  />
            <span className="landing-terminal__title">omnicorp_sec_db.sql</span>
          </div>
          <div className="landing-terminal__body">
            {SQL_LINES.map((line, i) => (
              <div
                key={i}
                className="landing-terminal__line"
                style={{ animationDelay: `${line.delay + 0.4}s` }}
              >
                <span className="landing-terminal__prompt">{line.prompt}</span>
                <span className={'muted' in line && line.muted
                  ? 'landing-terminal__output'
                  : 'landing-terminal__code'
                }>
                  {line.sql}
                </span>
              </div>
            ))}
            <div className="landing-terminal__cursor" style={{ animationDelay: '1.6s' }}>
              <span className="landing-terminal__prompt">&gt;</span>
              <span className="landing-terminal__blink">▋</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature grid ──────────────────────────────────────────────────── */}
      <section className="landing-features" aria-label="Features">
        {FEATURES.map((f) => (
          <div key={f.title} className="landing-feature-card">
            <div className="landing-feature-card__icon">{f.icon}</div>
            <h3 className="landing-feature-card__title">{f.title}</h3>
            <p className="landing-feature-card__desc">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="landing-footer">
        Built with React, TypeScript &amp; sql.js &middot; MIT License
      </footer>
    </div>
  );
}
