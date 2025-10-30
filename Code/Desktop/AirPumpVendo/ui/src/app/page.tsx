// ui/app/page.tsx
export default function Home() {
  return (
    <main className="wrap">
      <section className="card">
        <div className="icons">
          <span className="icon-badge icon-blue">
            {/* Wrench */}
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7.4 10.6 3 15l6 6 4.4-4.4-6-6zm9.93-6.79a4.5 4.5 0 0 1-5.71 5.71l-1.1 1.1 6 6 1.1-1.1a4.5 4.5 0 0 0 5.71-5.71l-3.2 3.2-2.83-2.83 3.2-3.2z" fill="currentColor"/>
            </svg>
          </span>
          <span className="icon-badge icon-green">
            {/* Shield */}
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3zm0 17.4C8.9 18.3 7 15.3 7 11.9V7l5-1.9L17 7v4.9c0 3.4-1.9 6.4-5 7.5z" fill="currentColor"/>
            </svg>
          </span>
          <span className="icon-badge icon-orange">
            {/* Gauge */}
            <svg width="26" height="26" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4a8 8 0 0 0-8 8h2a6 6 0 1 1 6 6v2a8 8 0 0 0 0-16zm-1 5v5h2l3.5 3.5 1.5-1.5L13 12V9h-2z" fill="currentColor"/>
            </svg>
          </span>
        </div>

        <h1 className="heading">Tire Service Kiosk</h1>
        <p className="subtitle">Your complete tire safety and maintenance solution</p>

        <div className="features">
          <div className="feature">
            <span className="feature-icon icon-blue-mini" aria-hidden="true">🔧</span>
            <span>Tire Code Info</span>
          </div>
          <div className="feature">
            <span className="feature-icon icon-green-mini" aria-hidden="true">🛡️</span>
            <span>DOT Safety Check</span>
          </div>
          <div className="feature">
            <span className="feature-icon icon-orange-mini" aria-hidden="true">🏎️</span>
            <span>Tire Inflation</span>
          </div>
        </div>

        <button className="cta" type="button">
          Click Any Button to Start
        </button>
      </section>
    </main>
  );
}
