import React, { useEffect, useState } from 'react';
import { MOODS } from '../data/moods';
import './FindingScreen.css';

export default function FindingScreen({
  selectedMood = 'cosy',
  onComplete,
  onLogoClick,
  autoAdvance = true,
  autoAdvanceDelay = 3200,
}) {
  const [isNarrowingDone, setIsNarrowingDone] = useState(false);

  // Find human-readable mood title (e.g. 'cosy' -> 'cosy')
  const currentMoodObj = MOODS.find((m) => m.id === selectedMood);
  const moodName = (currentMoodObj?.title || selectedMood || 'cosy').toLowerCase();

  // Progressively simulate the finding state and auto-advance
  useEffect(() => {
    if (!autoAdvance || !onComplete) return;

    // After 2.4s, mark the 3rd step as checked just before transition
    const checkTimer = setTimeout(() => {
      setIsNarrowingDone(true);
    }, 2400);

    // After autoAdvanceDelay, transition to the recommendation
    const advanceTimer = setTimeout(() => {
      onComplete();
    }, autoAdvanceDelay);

    return () => {
      clearTimeout(checkTimer);
      clearTimeout(advanceTimer);
    };
  }, [autoAdvance, autoAdvanceDelay, onComplete]);

  const handleSkip = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="finding-screen-wrapper">
      <div className="finding-screen">
        {/* Top Header */}
        <header className="finding-header">
          <button
            type="button"
            className="finding-logo-btn"
            onClick={onLogoClick}
            aria-label="Cravly Home"
          >
            <span className="finding-logo">
              Cravly<span className="finding-logo-dot">.</span>
            </span>
          </button>
          <span className="finding-step-label">Step 3 of 3</span>
        </header>

        {/* 3-Segment Progress Bar - all 3 active / filled in amber */}
        <div
          className="finding-progress-bar"
          role="progressbar"
          aria-valuenow={3}
          aria-valuemin={1}
          aria-valuemax={3}
          aria-label="Step 3 of 3"
        >
          <div className="finding-progress-segment active" />
          <div className="finding-progress-segment active" />
          <div className="finding-progress-segment active" />
        </div>

        {/* Main Content Area */}
        <main className="finding-main">
          {/* Animated Concentric Circle Loader */}
          <div className="finding-loader-container" aria-hidden="true">
            <svg
              className="finding-loader-svg"
              viewBox="0 0 186 186"
              width="186"
              height="186"
            >
              {/* Outer track circle (deep forest green) */}
              <circle
                cx="93"
                cy="93"
                r="87.5"
                fill="none"
                stroke="#245842"
                strokeWidth="11"
              />

              {/* Outer rotating progress arc (amber/orange) */}
              <circle
                className="finding-arc-spin"
                cx="93"
                cy="93"
                r="87.5"
                fill="none"
                stroke="#F4A53A"
                strokeWidth="11"
                strokeDasharray="150 400"
                strokeLinecap="round"
              />

              {/* Middle circular ring (soft ivory cream) */}
              <circle
                cx="93"
                cy="93"
                r="55"
                fill="#FAF5EA"
              />

              {/* Inner circle badge (warm amber) */}
              <circle
                cx="93"
                cy="93"
                r="38"
                fill="#F4A53A"
              />

              {/* Center smooth sine wave (deep dark green) */}
              <path
                d="M 70 93 C 76 80, 87 80, 93 93 C 99 106, 110 106, 116 93"
                fill="none"
                stroke="#1B4332"
                strokeWidth="3.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Heading & Subtitle */}
          <div className="finding-text-group">
            <h1 className="finding-title">
              Finding your {moodName} meal
            </h1>
            <p className="finding-subtitle">
              We&apos;ll bring you one great pick, not a list of fifty.
            </p>
          </div>

          {/* Steps Checklist */}
          <div className="finding-steps-list" role="status" aria-live="polite">
            {/* Step 1: Reading your mood (Checked) */}
            <div className="finding-step-item">
              <div className="finding-step-icon done">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 5"
                    stroke="#1B4332"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="finding-step-text">Reading your mood</span>
            </div>

            {/* Step 2: Checking what's open near you (Checked) */}
            <div className="finding-step-item">
              <div className="finding-step-icon done">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3.5 8.5L6.5 11.5L12.5 5"
                    stroke="#1B4332"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <span className="finding-step-text">Checking what&apos;s open near you</span>
            </div>

            {/* Step 3: Narrowing it down to one (In Progress / Active) */}
            <div className="finding-step-item">
              {isNarrowingDone ? (
                <div className="finding-step-icon done done-animate">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5L6.5 11.5L12.5 5"
                      stroke="#1B4332"
                      strokeWidth="2.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              ) : (
                <div className="finding-step-icon active" aria-hidden="true" />
              )}
              <span className="finding-step-text active">
                Narrowing it down to one
              </span>
            </div>
          </div>
        </main>

        {/* Bottom CTA / Skip Option */}
        <footer className="finding-footer">
          <button
            type="button"
            className="finding-skip-btn"
            onClick={handleSkip}
          >
            Skip ahead to my pick
          </button>
        </footer>
      </div>
    </div>
  );
}
