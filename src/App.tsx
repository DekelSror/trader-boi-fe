import MarketManagerPage from "./market_manager";
import './theme.css';

function Header() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <h1 className="app-header-title">Trader Boi</h1>
          <nav className="app-header-nav">
            <a href="/" className="app-header-link">Home</a>
            <a href="/market" className="app-header-link">Market</a>
          </nav>
        </div>
        <div className="app-header-page">Market Manager</div>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <div id='trader-boi-app' style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-main)'
    }}>
      <Header />
      <main className="app-main">
        <MarketManagerPage />
      </main>
    </div>
  );
}