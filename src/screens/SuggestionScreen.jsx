import React, { useState } from 'react';
import { getSwiggyUrl, getZomatoUrl, getYouTubeUrl } from '../utils/recommendationEngine';
import './SuggestionScreen.css';

const DEFAULT_PRIMARY_DISH = {
  id: 'v-l-o-2',
  name: 'Bisi bele bath with boondi',
  region: 'Karnataka',
  description: 'Spiced rice and lentil mash with veggies & crisp boondi',
  why: 'Warm, soft and slow, just the cosy you picked. Veg, and inside your ₹150 – ₹400 budget.',
  time: 'about 30 min',
  price: '₹[price]',
  dietType: 'veg',
  searchTerm: 'bisi bele bath'
};

const DEFAULT_SWAP_DISHES = [
  {
    id: 'v-l-o-9',
    name: 'Curd rice with tempering',
    region: 'South Indian',
    time: 'about 30 min',
    price: '₹[price]',
    dietType: 'veg',
    searchTerm: 'curd rice'
  },
  {
    id: 'v-l-o-11',
    name: 'Millet pongal with ghee',
    region: 'South Indian',
    time: 'about 30 min',
    price: '₹[price]',
    dietType: 'veg',
    searchTerm: 'ven pongal'
  }
];

export default function SuggestionScreen({
  dish,
  suggestions = [],
  selectedMood = 'cosy',
  dietType = 'veg',
  mode = 'order',
  budget = [150, 400],
  onBack,
  onLogoClick,
  onShuffle,
  onSelect,
  onOrderOrCook,
}) {
  const [showProviderModal, setShowProviderModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [savedDishIds, setSavedDishIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cravly_saved_dishes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const activeDish = dish || DEFAULT_PRIMARY_DISH;
  const isSaved = savedDishIds.includes(activeDish.id);

  // Fallback swap items if suggestions has fewer than 3 items
  const swapDishes = [
    suggestions[1] || DEFAULT_SWAP_DISHES[0],
    suggestions[2] || DEFAULT_SWAP_DISHES[1]
  ];

  // Format labels
  const moodLabel = selectedMood
    ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1).toLowerCase()
    : 'Cosy';

  const dietLabel = dietType === 'non-veg'
    ? 'Non-veg'
    : dietType === 'egg'
      ? 'Egg'
      : dietType === 'vegan'
        ? 'Vegan'
        : dietType === 'jain'
          ? 'Jain'
          : 'Veg';

  const budgetLabel = budget && budget.length === 2
    ? `₹${budget[0]} – ₹${budget[1]}`
    : '₹150 – ₹400';

  const modeLabel = mode === 'cook' ? 'Cook at home' : 'Order in';

  // Format "WHY THIS ONE" reasoning text
  const getWhyText = () => {
    if (activeDish.why && activeDish.why.includes('inside your')) {
      return activeDish.why;
    }

    const moodWord = (selectedMood || 'cosy').toLowerCase();
    const budgetStr = budgetLabel;

    let descriptor = 'Warm, soft and slow';
    if (moodWord === 'fresh') descriptor = 'Light, crisp and vibrant';
    else if (moodWord === 'hungry') descriptor = 'Hearty, deeply satisfying and bold';
    else if (moodWord === 'lazy') descriptor = 'Effortless, quick and comforting';
    else if (moodWord === 'adventurous') descriptor = 'Zesty, aromatic and surprising';
    else if (moodWord === 'celebrating') descriptor = 'Rich, indulgent and festive';

    return `${descriptor}, just the ${moodWord} you picked. ${dietLabel}, and inside your ${budgetStr} budget.`;
  };

  // Format metadata line: "Region · Time · Price"
  const getMetaString = () => {
    const region = activeDish.region || (activeDish.id?.includes('pongal') || activeDish.id?.includes('curd') ? 'South Indian' : 'Karnataka');
    let timeStr = activeDish.time || 'about 30 min';
    if (!timeStr.includes('about')) {
      timeStr = `about ${timeStr.replace('m', ' min')}`;
    }
    const priceStr = activeDish.price || '₹[price]';
    return `${region} · ${timeStr} · ${priceStr}`;
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2400);
  };

  const handleToggleSave = () => {
    let next;
    if (isSaved) {
      next = savedDishIds.filter((id) => id !== activeDish.id);
      showToast('Removed from saved');
    } else {
      next = [...savedDishIds, activeDish.id];
      showToast('Saved to your list! 🔖');
    }
    setSavedDishIds(next);
    try {
      localStorage.setItem('cravly_saved_dishes', JSON.stringify(next));
    } catch {
      // storage unavailable
    }
  };

  const handleOpenPrimaryAction = () => {
    if (onOrderOrCook) {
      onOrderOrCook(activeDish, mode);
    } else {
      setShowProviderModal(true);
    }
  };

  const handleSelectProvider = (type) => {
    const term = activeDish.searchTerm || activeDish.name;
    let url = '';
    if (type === 'swiggy') url = getSwiggyUrl(term);
    else if (type === 'zomato') url = getZomatoUrl(term);
    else if (type === 'youtube') url = getYouTubeUrl(term);
    
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    setShowProviderModal(false);
  };

  return (
    <div className="suggestion-screen-wrapper">
      <div className="suggestion-screen animate-in">
        {/* Top Header */}
        <header className="suggestion-header">
          <button
            type="button"
            className="suggestion-back-btn"
            onClick={onBack}
            aria-label="Back to preferences"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#163929"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            className="suggestion-logo-btn"
            onClick={onLogoClick || onBack}
            aria-label="Cravly Home"
          >
            <span className="suggestion-logo">
              Cravly<span className="suggestion-logo-dot">.</span>
            </span>
          </button>

          <div className="suggestion-header-spacer" aria-hidden="true" />
        </header>

        {/* Preference Filter Pills Row */}
        <div className="suggestion-pills-row" role="region" aria-label="Selected preferences">
          <button
            type="button"
            className="suggestion-pill pill-mood"
            onClick={onBack}
            title="Edit mood"
          >
            {moodLabel}
          </button>
          <button
            type="button"
            className="suggestion-pill"
            onClick={onBack}
            title="Edit diet"
          >
            {dietLabel}
          </button>
          <button
            type="button"
            className="suggestion-pill"
            onClick={onBack}
            title="Edit budget"
          >
            {budgetLabel}
          </button>
          <button
            type="button"
            className="suggestion-pill"
            onClick={onBack}
            title="Edit mode"
          >
            {modeLabel}
          </button>
        </div>

        {/* Hero Match Card */}
        <div className="suggestion-card">
          <span className="suggestion-match-badge">YOUR MATCH</span>

          {/* Central graphic dish illustration matching the design */}
          <div className="suggestion-avatar-wrapper" aria-hidden="true">
            <svg
              className="suggestion-avatar-svg"
              viewBox="0 0 170 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer teal-green ring */}
              <circle cx="85" cy="85" r="82" fill="#25513f" />

              {/* Middle crisp white ring */}
              <circle cx="85" cy="85" r="68" fill="#ffffff" />

              {/* Inner apricot-gold circle */}
              <circle cx="85" cy="85" r="56" fill="#f4a528" />

              {/* Top white dot */}
              <circle cx="87" cy="48" r="4.2" fill="#ffffff" />

              {/* Left red dot */}
              <circle cx="58" cy="62" r="5.5" fill="#cc4930" />

              {/* Right red dot */}
              <circle cx="112" cy="62" r="5.5" fill="#cc4930" />

              {/* Bottom-left white dot */}
              <circle cx="73" cy="111" r="4.2" fill="#ffffff" />

              {/* Dark green wave line with terminal circular nodes */}
              <path
                d="M 51 90 C 58 97, 65 99, 73 87 C 82 73, 90 69, 98 71 C 107 73, 114 104, 124 102 C 129 100, 131 92, 133 85"
                stroke="#183d2c"
                strokeWidth="4.5"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="51" cy="90" r="4" fill="#183d2c" />
              <circle cx="133" cy="85" r="4" fill="#183d2c" />
            </svg>
          </div>

          <span className="suggestion-photo-notice">Photo to come</span>
        </div>

        {/* Dish Title & Meta Info */}
        <div className="suggestion-details">
          <h1 className="suggestion-dish-title">{activeDish.name}</h1>

          <div className="suggestion-meta-row">
            {/* Diet indicator */}
            <span
              className={`diet-mark ${
                activeDish.dietType === 'non-veg' || activeDish.id?.startsWith('nv')
                  ? 'diet-nonveg'
                  : activeDish.dietType === 'egg' || activeDish.id?.startsWith('e')
                    ? 'diet-egg'
                    : 'diet-veg'
              }`}
              title={dietLabel}
              aria-label={dietLabel}
            >
              <span className="diet-mark-dot" />
            </span>

            <span className="suggestion-meta-text">{getMetaString()}</span>
          </div>
        </div>

        {/* WHY THIS ONE Box */}
        <div className="suggestion-why-card">
          <div className="suggestion-why-label">WHY THIS ONE</div>
          <p className="suggestion-why-text">{getWhyText()}</p>
        </div>

        {/* Primary CTA Button */}
        <button
          type="button"
          className="suggestion-cta-primary"
          onClick={handleOpenPrimaryAction}
        >
          <span>Order or cook this</span>
          <span className="suggestion-arrow-icon" aria-hidden="true">→</span>
        </button>

        {/* Secondary Action Row: Not for me & Save */}
        <div className="suggestion-actions-row">
          <button
            type="button"
            className="suggestion-btn-secondary suggestion-btn-not-for-me"
            onClick={onShuffle}
            title="Show another match"
          >
            Not for me
          </button>

          <button
            type="button"
            className={`suggestion-btn-secondary suggestion-btn-save ${isSaved ? 'saved' : ''}`}
            onClick={handleToggleSave}
            title={isSaved ? 'Dish saved' : 'Save dish'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isSaved ? '#163929' : 'none'}
              stroke="#163929"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* "Or swap for" Section */}
        <section className="suggestion-swap-section">
          <h2 className="suggestion-swap-heading">Or swap for</h2>
          <div className="suggestion-swap-grid">
            {swapDishes.map((altItem, idx) => {
              if (!altItem) return null;
              const altRegion = altItem.region || 'South Indian';
              const altTime = altItem.time ? (altItem.time.includes('about') ? altItem.time : `about ${altItem.time.replace('m', ' min')}`) : 'about 30 min';

              return (
                <button
                  key={altItem.id || idx}
                  type="button"
                  className="suggestion-swap-card"
                  onClick={() => onSelect && onSelect(idx + 1)}
                  title={`Swap to ${altItem.name}`}
                >
                  <h3 className="suggestion-swap-title">{altItem.name}</h3>
                  <p className="suggestion-swap-sub">{`${altRegion} · ${altTime}`}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* Toast Notification */}
        {toastMessage && (
          <div className="suggestion-toast" role="status" aria-live="polite">
            {toastMessage}
          </div>
        )}

        {/* Provider Action Modal */}
        {showProviderModal && (
          <div
            className="provider-modal-backdrop"
            onClick={() => setShowProviderModal(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div
              className="provider-modal-card"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 id="modal-title" className="provider-modal-title">
                {activeDish.name}
              </h3>
              <p className="provider-modal-desc">
                Choose how you would like to enjoy this meal:
              </p>

              <div className="provider-options-list">
                <button
                  type="button"
                  className="provider-option-btn"
                  onClick={() => handleSelectProvider('swiggy')}
                >
                  <span>Order on Swiggy</span>
                  <span>↗</span>
                </button>
                <button
                  type="button"
                  className="provider-option-btn"
                  onClick={() => handleSelectProvider('zomato')}
                >
                  <span>Order on Zomato</span>
                  <span>↗</span>
                </button>
                <button
                  type="button"
                  className="provider-option-btn"
                  onClick={() => handleSelectProvider('youtube')}
                >
                  <span>Watch Recipe on YouTube</span>
                  <span>↗</span>
                </button>
              </div>

              <button
                type="button"
                className="provider-modal-cancel"
                onClick={() => setShowProviderModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
