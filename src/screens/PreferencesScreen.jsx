import React, { useState } from 'react';
import { MOODS } from '../data/moods';
import './PreferencesScreen.css';

const HUNGER_OPTIONS = [
  { id: 'peckish', label: 'Peckish' },
  { id: 'proper', label: 'Proper meal' },
  { id: 'starving', label: 'Starving' },
];

const TIME_OPTIONS = [
  { id: '20', label: '20 min' },
  { id: '45', label: '45 min' },
  { id: 'no-rush', label: 'No rush' },
];

const DIET_OPTIONS = [
  { id: 'veg', label: 'Veg' },
  { id: 'egg', label: 'Egg' },
  { id: 'non-veg', label: 'Non-veg' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'jain', label: 'Jain' },
];

const MIN_BUDGET = 50;
const MAX_BUDGET = 1000;
const BUDGET_STEP = 25;

export default function PreferencesScreen({
  selectedMood = 'cosy',
  initialMode = 'order',
  initialHunger = 'proper',
  initialTime = '45',
  initialDiet = 'veg',
  initialBudget = [150, 400],
  onBack,
  onMatchMeal,
}) {
  const [mode, setMode] = useState(initialMode);
  const [hunger, setHunger] = useState(initialHunger);
  const [time, setTime] = useState(initialTime);
  const [diet, setDiet] = useState(initialDiet);
  const [budget, setBudget] = useState(initialBudget);

  // Find title of current mood
  const currentMoodObj = MOODS.find((m) => m.id === selectedMood) || { title: 'Cosy' };
  const moodTitle = currentMoodObj.title || 'Cosy';

  // Budget slider change handlers
  const handleMinBudgetChange = (val) => {
    const newMin = Math.min(val, budget[1] - BUDGET_STEP);
    setBudget([newMin, budget[1]]);
  };

  const handleMaxBudgetChange = (val) => {
    const newMax = Math.max(val, budget[0] + BUDGET_STEP);
    setBudget([budget[0], newMax]);
  };

  const minPercent = Math.max(0, Math.min(100, ((budget[0] - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100));
  const maxPercent = Math.max(0, Math.min(100, ((budget[1] - MIN_BUDGET) / (MAX_BUDGET - MIN_BUDGET)) * 100));

  const handleSubmit = () => {
    if (onMatchMeal) {
      onMatchMeal({
        mood: selectedMood,
        mode,
        hunger,
        time,
        dietType: diet,
        budget,
      });
    }
  };

  return (
    <div className="preferences-screen-wrapper">
      <div className="preferences-screen">
        {/* Top Header */}
        <header className="preferences-header">
          <button
            type="button"
            className="preferences-back-btn"
            onClick={onBack}
            aria-label="Back to previous step"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#163929"
              strokeWidth="2.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="preferences-step-label">Step 2 of 3</span>
        </header>

        {/* 3-Segment Stepper Progress Bar */}
        <div className="preferences-progress-bar" role="progressbar" aria-valuenow={2} aria-valuemin={1} aria-valuemax={3}>
          <div className="preferences-progress-segment active" />
          <div className="preferences-progress-segment active" />
          <div className="preferences-progress-segment" />
        </div>

        {/* Headline */}
        <h1 className="preferences-title">
          {moodTitle} it is. A few quick<br />taps.
        </h1>

        {/* 1. Order in or cook? */}
        <section className="preferences-section">
          <h2 className="preferences-section-label">Order in or cook?</h2>
          <div className="mode-cards-grid">
            {/* Order in */}
            <button
              type="button"
              className={`mode-card ${mode === 'order' ? 'selected' : ''}`}
              onClick={() => setMode('order')}
              aria-pressed={mode === 'order'}
            >
              <div className="mode-card-icon" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#163929"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9Z" />
                  <path d="M9 9V6.5a3 3 0 0 1 6 0V9" />
                </svg>
              </div>
              <div className="mode-card-title">Order in</div>
              <div className="mode-card-subtitle">Ready in about 30 min</div>
            </button>

            {/* Cook it */}
            <button
              type="button"
              className={`mode-card ${mode === 'cook' ? 'selected' : ''}`}
              onClick={() => setMode('cook')}
              aria-pressed={mode === 'cook'}
            >
              <div className="mode-card-icon" aria-hidden="true">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#163929"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 3.5L10 6.5" />
                  <path d="M14.5 3.5L16 6.5" />
                  <path d="M5 11h14" />
                  <path d="M5.5 11c0 4.4 3 7.5 6.5 7.5s6.5-3.1 6.5-7.5" />
                  <path d="M3 11.5h2.5" />
                  <path d="M18.5 11.5H21" />
                </svg>
              </div>
              <div className="mode-card-title">Cook it</div>
              <div className="mode-card-subtitle">Guided, step by step</div>
            </button>
          </div>
        </section>

        {/* 2. How hungry? */}
        <section className="preferences-section">
          <h2 className="preferences-section-label">How hungry?</h2>
          <div className="pills-group" role="radiogroup" aria-label="How hungry?">
            {HUNGER_OPTIONS.map((opt) => {
              const isSelected = hunger === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`pref-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => setHunger(opt.id)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 3. Time you have */}
        <section className="preferences-section">
          <h2 className="preferences-section-label">Time you have</h2>
          <div className="pills-group" role="radiogroup" aria-label="Time you have">
            {TIME_OPTIONS.map((opt) => {
              const isSelected = time === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`pref-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => setTime(opt.id)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. What do you eat? */}
        <section className="preferences-section">
          <h2 className="preferences-section-label">What do you eat?</h2>
          <div className="pills-group" role="radiogroup" aria-label="What do you eat?">
            {DIET_OPTIONS.map((opt) => {
              const isSelected = diet === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`pref-pill ${isSelected ? 'selected' : ''}`}
                  onClick={() => setDiet(opt.id)}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 5. Budget per person */}
        <section className="preferences-section">
          <div className="budget-header">
            <h2 className="budget-label">Budget per person</h2>
            <div className="budget-value">
              ₹{budget[0]} – ₹{budget[1]}
            </div>
          </div>

          <div className="range-slider-container">
            <div className="range-track-bg" />
            <div
              className="range-track-active"
              style={{
                left: `${minPercent}%`,
                width: `${maxPercent - minPercent}%`,
              }}
            />
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={BUDGET_STEP}
              value={budget[0]}
              onChange={(e) => handleMinBudgetChange(Number(e.target.value))}
              className={`range-input range-input--min ${budget[0] > MAX_BUDGET - 100 ? 'range-input--above' : ''}`}
              aria-label="Minimum budget per person"
            />
            <input
              type="range"
              min={MIN_BUDGET}
              max={MAX_BUDGET}
              step={BUDGET_STEP}
              value={budget[1]}
              onChange={(e) => handleMaxBudgetChange(Number(e.target.value))}
              className="range-input range-input--max"
              aria-label="Maximum budget per person"
            />
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="preferences-cta-container">
          <button
            type="button"
            className="preferences-cta-btn"
            onClick={handleSubmit}
          >
            <span>Match my meal</span>
            <span className="preferences-cta-arrow" aria-hidden="true">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e38927"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
