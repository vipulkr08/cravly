import React from 'react';

function Header({ onSurpriseMe, theme, toggleTheme, onLogoClick }) {
    return (
        <header className="minimal-header">
          <div className="header-inner">
            <div className="logo-text" role="button" tabIndex={0} onClick={onLogoClick} onKeyDown={(e) => e.key === 'Enter' && onLogoClick && onLogoClick()}>
              Cravly<span className="logo-dot">.</span>
            </div>
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
