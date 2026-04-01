import React from 'react';

function Header({ onSurpriseMe, theme, toggleTheme, onLogoClick }) {
    return (
        <header className="minimal-header">
          <div className="header-inner">
            <h1 className="logo-text" onClick={onLogoClick}>
              Cravly<span className="logo-dot">.</span>
            </h1>
            <div className="header-actions">
              <button 
                className="theme-toggle" 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button className="btn-surprise" onClick={onSurpriseMe}>
                SURPRISE ME
              </button>
            </div>
          </div>
        </header>
    );
}

export default Header;
