import React, { useState } from 'react';
import { MOODS, CITIES } from '../data/moods';
import './MoodScreen.css';

const MOOD_ICONS = {
  cosy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#163929" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M3 8h14v7a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V8z" />
      <path d="M7 2.5c0 1.2 1.2 1.8 1.2 2.8" />
      <path d="M11 1.5c0 1.2 1.2 1.8 1.2 2.8" />
    </svg>
  ),
  hungry: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#163929" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v20" />
      <path d="M18 2a3 3 0 0 0-3 3v6h3" />
      <path d="M6 2v7a2 2 0 0 0 2 2v11" />
      <path d="M10 2v7a2 2 0 0 1-2 2" />
      <path d="M8 2v7" />
    </svg>
  ),
  fresh: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#163929" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19.5 4.5c-4.5 0-9 2-11.5 4.5S4 15 4 19.5c4.5 0 9-2 11.5-4.5s4-6 4-10.5z" />
      <path d="M8.5 15.5L15.5 8.5" />
    </svg>
  ),
  adventurous: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#163929" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <polygon points="16 8 13.5 13.5 8 16 10.5 10.5" fill="none" stroke="#163929" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  ),
  lazy: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#163929" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  ),
  celebrating: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#163929" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2C12 7.5 7.5 12 2 12C7.5 12 12 16.5 12 22C12 16.5 16.5 12 22 12C16.5 12 12 7.5 12 2Z" />
    </svg>
  ),
};

function MoodScreen({
  selectedMood = 'cosy',
  onSelectMood,
  onShowPicks,
  onLogoClick,
  mode = 'order',
  onToggleMode,
  city = 'Bengaluru',
  onChangeCity,
  dietType = 'veg',
  onChangeDiet,
}) {
  const [activeMood, setActiveMood] = useState(selectedMood);
  const [activeTab, setActiveTab] = useState('home');
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const currentMoodObj = MOODS.find((m) => m.id === activeMood) || MOODS[0];

  const handleCardClick = (id) => {
    setActiveMood(id);
    if (onSelectMood) onSelectMood(id);
  };

  const handleCtaClick = () => {
    if (onShowPicks) {
      onShowPicks(activeMood);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === 'cook') {
      if (onToggleMode) onToggleMode('cook');
      if (onShowPicks) onShowPicks(activeMood, 'cook');
    } else if (tab === 'saved') {
      setShowSavedModal(true);
    } else if (tab === 'you') {
      setShowProfileModal(true);
    }
  };

  return (
    <div className="mood-screen-wrapper">
      <div className="mood-screen">
        {/* Top Header */}
        <header className="mood-header">
          <button className="mood-logo-btn" onClick={onLogoClick} aria-label="Cravly Home">
            <span className="mood-logo">
              Cravly<span className="mood-logo-dot">.</span>
            </span>
          </button>

          <button
            className="mood-location-pill"
            onClick={() => setShowCityPicker(true)}
            aria-label="Change city"
          >
            <svg
              className="mood-pin-icon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{city}</span>
          </button>
        </header>

        {/* Hero Section */}
        <div className="mood-hero">
          <h1 className="mood-title">
            How are you feeling<br />right now?
          </h1>
          <p className="mood-subtitle">
            Pick the closest one. We'll handle the menu.
          </p>
        </div>

        {/* 2x3 Mood Grid */}
        <div className="mood-grid" role="radiogroup" aria-label="Select food mood">
          {MOODS.map((mood) => {
            const isSelected = activeMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                className={`mood-card ${isSelected ? 'mood-card--selected' : ''}`}
                style={{ backgroundColor: mood.bg }}
                onClick={() => handleCardClick(mood.id)}
              >
                {/* Top row of card */}
                <div className="mood-card-top">
                  <div className="mood-card-icon-badge">
                    {MOOD_ICONS[mood.id]}
                  </div>
                  {isSelected && (
                    <div className="mood-card-check-badge" aria-hidden="true">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#ffffff"
                        strokeWidth="3.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Bottom text of card */}
                <div className="mood-card-bottom">
                  <div className="mood-card-title">{mood.title}</div>
                  <div className="mood-card-desc">{mood.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Primary Action Button */}
        <div className="mood-cta-container">
          <button
            className="mood-primary-btn"
            onClick={handleCtaClick}
            aria-label={`Show my ${currentMoodObj.title} picks`}
          >
            <span>Show my {currentMoodObj.title} picks</span>
            <span className="mood-btn-arrow" aria-hidden="true">→</span>
          </button>
        </div>

        {/* Bottom Navigation Bar */}
        <nav className="mood-bottom-nav" aria-label="Main Navigation">
          <button
            type="button"
            className={`mood-nav-item ${activeTab === 'home' ? 'mood-nav-item--active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            <div className="mood-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9.5L12 3l9 6.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9.5z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
            <span className="mood-nav-label">Home</span>
          </button>

          <button
            type="button"
            className={`mood-nav-item ${activeTab === 'saved' ? 'mood-nav-item--active' : ''}`}
            onClick={() => handleTabClick('saved')}
          >
            <div className="mood-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="mood-nav-label">Saved</span>
          </button>

          <button
            type="button"
            className={`mood-nav-item ${activeTab === 'cook' ? 'mood-nav-item--active' : ''}`}
            onClick={() => handleTabClick('cook')}
          >
            <div className="mood-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 11h14a2 2 0 0 1 2 2v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5v-2a2 2 0 0 1 2-2z" />
                <path d="M2 13h2" />
                <path d="M20 13h2" />
                <path d="M9 4c0 1.5 1.5 2 1.5 3" />
                <path d="M13.5 4c0 1.5 1.5 2 1.5 3" />
              </svg>
            </div>
            <span className="mood-nav-label">Cook</span>
          </button>

          <button
            type="button"
            className={`mood-nav-item ${activeTab === 'you' ? 'mood-nav-item--active' : ''}`}
            onClick={() => handleTabClick('you')}
          >
            <div className="mood-nav-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <span className="mood-nav-label">You</span>
          </button>
        </nav>
      </div>

      {/* City Picker Bottom Sheet / Modal */}
      {showCityPicker && (
        <div className="mood-modal-backdrop" onClick={() => setShowCityPicker(false)}>
          <div className="mood-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mood-modal-header">
              <h3>Select City</h3>
              <button className="mood-modal-close" onClick={() => setShowCityPicker(false)}>✕</button>
            </div>
            <div className="mood-city-list">
              {CITIES.map((c) => (
                <button
                  key={c}
                  className={`mood-city-item ${city === c ? 'mood-city-item--active' : ''}`}
                  onClick={() => {
                    if (onChangeCity) onChangeCity(c);
                    setShowCityPicker(false);
                  }}
                >
                  <span>{c}</span>
                  {city === c && <span className="mood-city-check">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Saved Modal */}
      {showSavedModal && (
        <div className="mood-modal-backdrop" onClick={() => setShowSavedModal(false)}>
          <div className="mood-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mood-modal-header">
              <h3>Saved Recommendations</h3>
              <button className="mood-modal-close" onClick={() => setShowSavedModal(false)}>✕</button>
            </div>
            <div className="mood-modal-content">
              <p className="mood-modal-empty">
                Bookmarks will appear here once you save a dish you love!
              </p>
              <button
                className="mood-primary-btn"
                style={{ marginTop: '16px' }}
                onClick={() => setShowSavedModal(false)}
              >
                Browse Recommendations
              </button>
            </div>
          </div>
        </div>
      )}

      {/* You / Preferences Modal */}
      {showProfileModal && (
        <div className="mood-modal-backdrop" onClick={() => setShowProfileModal(false)}>
          <div className="mood-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="mood-modal-header">
              <h3>Your Preferences</h3>
              <button className="mood-modal-close" onClick={() => setShowProfileModal(false)}>✕</button>
            </div>
            <div className="mood-modal-content">
              <label className="mood-pref-label">Dietary Preference</label>
              <div className="mood-pref-pills">
                {['veg', 'non-veg', 'egg'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    className={`mood-pref-pill ${dietType === type ? 'active' : ''}`}
                    onClick={() => {
                      if (onChangeDiet) onChangeDiet(type);
                    }}
                  >
                    {type === 'veg' ? '🌱 Pure Veg' : type === 'non-veg' ? '🍗 Non-Veg' : '🥚 Eggetarian'}
                  </button>
                ))}
              </div>

              <label className="mood-pref-label" style={{ marginTop: '16px' }}>Default Discovery Mode</label>
              <div className="mood-pref-pills">
                <button
                  type="button"
                  className={`mood-pref-pill ${mode === 'order' ? 'active' : ''}`}
                  onClick={() => {
                    if (onToggleMode) onToggleMode('order');
                  }}
                >
                  🛵 Order Food
                </button>
                <button
                  type="button"
                  className={`mood-pref-pill ${mode === 'cook' ? 'active' : ''}`}
                  onClick={() => {
                    if (onToggleMode) onToggleMode('cook');
                  }}
                >
                  🍳 Cook at Home
                </button>
              </div>

              <button
                className="mood-primary-btn"
                style={{ marginTop: '24px' }}
                onClick={() => setShowProfileModal(false)}
              >
                Save & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MoodScreen;
