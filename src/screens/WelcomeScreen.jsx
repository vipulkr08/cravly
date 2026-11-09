import React from 'react';
import './WelcomeScreen.css';

function WelcomeScreen({ onGetStarted, onLogin }) {
  return (
    <div className="welcome-screen">
      {/* Header */}
      <header className="welcome-header">
        <div className="welcome-logo">
          Cravly<span className="welcome-logo-dot">.</span>
        </div>
        <button className="welcome-location-btn" aria-label="Change location">
          <svg
            className="welcome-location-icon"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Bengaluru
        </button>
      </header>

      {/* Hero Text */}
      <div className="welcome-hero">
        <p className="welcome-eyebrow">STOP SCROLLING, START EATING</p>
        <h1 className="welcome-headline">
          Match your meal<br />to your mood.
        </h1>
        <p className="welcome-subtext">
          Order or cook the perfect meal tonight. No decision fatigue, just delicious.
        </p>
      </div>

      {/* Illustrated Plate */}
      <div className="welcome-plate-wrapper" aria-hidden="true">
        {/* Outer dark ring */}
        <div className="plate-ring-outer">
          {/* Middle cream ring */}
          <div className="plate-ring-middle">
            {/* Inner food surface */}
            <div className="plate-food">
              {/* Decorative dots */}
              <span className="plate-dot plate-dot--red plate-dot--tl" />
              <span className="plate-dot plate-dot--white plate-dot--tr" />
              <span className="plate-dot plate-dot--red plate-dot--mr" />
              <span className="plate-dot plate-dot--white plate-dot--bl" />

              {/* Squiggle / smile icon */}
              <svg
                className="plate-squiggle"
                viewBox="0 0 120 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M10 30 C30 5, 50 55, 70 30 C90 5, 110 50, 110 30"
                  stroke="#1B4332"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* CTAs */}
      <div className="welcome-cta">
        <button className="welcome-btn-primary" onClick={onGetStarted}>
          Find my meal
          <span className="welcome-btn-arrow">→</span>
        </button>
        <button className="welcome-btn-ghost" onClick={onLogin}>
          I already have an account
        </button>
      </div>
    </div>
  );
}

export default WelcomeScreen;
