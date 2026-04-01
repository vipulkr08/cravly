import React from 'react';

function Header({ onSurpriseMe, theme, toggleTheme }) {
    return (
        <header className="minimal-header">
          <div className="header-inner">
            <h1 className="logo-text">Cravely</h1>
            <div className="header-actions">
              <button 
                className="theme-toggle" 
                onClick={toggleTheme} 
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button className="btn-surprise" onClick={onSurpriseMe}>
                Surprise Me
              </button>
            </div>
          </div>
        </header>
    );
}

export default Header;
