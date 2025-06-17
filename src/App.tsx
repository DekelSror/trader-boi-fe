import React, { useState, useEffect } from 'react';
import MarketManagerPage from "./market_manager";
import './theme.css';
import AlgoCanvas from './algo_canvas';

type Page = 'home' | 'market' | 'algo-builder';

function Header({ currentPage, onPageChange }: { currentPage: Page, onPageChange: (page: Page) => void }) {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
          <h1 className="app-header-title">Trader Boi</h1>
          <nav className="app-header-nav">
            <a 
              href="#" 
              className="app-header-link" 
              onClick={(e) => { e.preventDefault(); onPageChange('home'); }}
              style={{ textDecoration: currentPage === 'home' ? 'underline' : 'none' }}
            >
              Home
            </a>
            <a 
              href="#" 
              className="app-header-link"
              onClick={(e) => { e.preventDefault(); onPageChange('market'); }}
              style={{ textDecoration: currentPage === 'market' ? 'underline' : 'none' }}
            >
              Market
            </a>
            <a 
              href="#" 
              className="app-header-link"
              onClick={(e) => { e.preventDefault(); onPageChange('algo-builder'); }}
              style={{ textDecoration: currentPage === 'algo-builder' ? 'underline' : 'none' }}
            >
              Algo Builder
            </a>
          </nav>
        </div>
        <div className="app-header-page">
          {currentPage === 'home' && 'Home'}
          {currentPage === 'market' && 'Market Manager'}
          {currentPage === 'algo-builder' && 'Algo Builder'}
        </div>
      </div>
    </header>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>(() => {
    const savedPage = localStorage.getItem('currentPage');
    return (savedPage as Page) || 'market';
  });

  useEffect(() => {
    localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'market':
        return <MarketManagerPage />;
      case 'algo-builder':
        return <AlgoCanvas />;
      case 'home':
        return <div>Welcome to Trader Boi</div>;
      default:
        return <MarketManagerPage />;
    }
  };

  return (
    <div id='trader-boi-app' style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'var(--color-bg)',
      fontFamily: 'var(--font-main)'
    }}>
      <Header currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}