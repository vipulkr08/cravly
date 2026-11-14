import React, { useState } from 'react';
import { getSwiggyUrl, getZomatoUrl, getYouTubeUrl } from '../utils/recommendationEngine';
import './CookOrOrderScreen.css';

const DEFAULT_DISH = {
  id: 'v-l-o-2',
  name: 'Bisi bele bath with boondi',
  region: 'Karnataka',
  description: 'Spiced rice and lentil mash with veggies & crisp boondi',
  why: 'Warm, soft and slow, just the cosy you picked. Veg, and inside your ₹150 – ₹400 budget.',
  time: 'About [X] min',
  price: '₹[price]',
  dietType: 'veg',
  searchTerm: 'Bisi bele bath',
};

export default function CookOrOrderScreen({
  dish,
  selectedMood = 'cosy',
  dietType = 'veg',
  initialMode = 'order',
  onBack,
}) {
  const activeDish = dish || DEFAULT_DISH;
  const [activeTab, setActiveTab] = useState(initialMode === 'cook' ? 'cook' : 'order');
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Bookmark / Saved dish tracking
  const [savedDishIds, setSavedDishIds] = useState(() => {
    try {
      const saved = localStorage.getItem('cravly_saved_dishes');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const isSaved = savedDishIds.includes(activeDish.id);

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

  // Capitalized mood label (e.g. 'Cosy')
  const moodLabel = selectedMood
    ? selectedMood.charAt(0).toUpperCase() + selectedMood.slice(1).toLowerCase()
    : 'Cosy';

  // Diet label
  const dietLabel = dietType === 'non-veg'
    ? 'Non-veg'
    : dietType === 'egg'
      ? 'Egg'
      : dietType === 'vegan'
        ? 'Vegan'
        : dietType === 'jain'
          ? 'Jain'
          : 'Veg';

  // Region fallback
  const regionLabel = activeDish.region || 'Karnataka';

  // Search term formatting
  const orderSearchTerm = activeDish.searchTerm || activeDish.name || 'Bisi bele bath';
  const cookSearchTerm = `${orderSearchTerm} recipe`;
  const currentSearchTerm = activeTab === 'order' ? orderSearchTerm : cookSearchTerm;

  // Time and price labels
  const timeDisplay = activeDish.time
    ? (activeDish.time.toLowerCase().includes('about')
        ? activeDish.time.replace(/about/i, 'About')
        : `About ${activeDish.time}`)
    : 'About [X] min';

  const priceDisplay = activeDish.price
    ? (activeDish.price.startsWith('from') ? activeDish.price : `from ${activeDish.price}`)
    : 'from ₹[price]';

  const handleCopySearch = async () => {
    try {
      await navigator.clipboard.writeText(currentSearchTerm);
      setCopied(true);
      showToast('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast(`Search for: "${currentSearchTerm}"`);
    }
  };

  const handleOpenApp = (app) => {
    let url = '';
    if (app === 'appA' || app === 'swiggy') {
      url = getSwiggyUrl(orderSearchTerm);
    } else if (app === 'appB' || app === 'zomato') {
      url = getZomatoUrl(orderSearchTerm);
    } else if (app === 'youtube') {
      url = getYouTubeUrl(cookSearchTerm);
    } else if (app === 'google') {
      url = `https://www.google.com/search?q=${encodeURIComponent(cookSearchTerm)}`;
    } else if (app === 'grocery') {
      url = `https://www.swiggy.com/instamart/search?query=${encodeURIComponent(orderSearchTerm + ' ingredients')}`;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="cook-order-screen-wrapper">
      <div className="cook-order-screen animate-in">
        {/* Top Navigation Bar: Back & Bookmark */}
        <header className="cook-order-nav">
          <button
            type="button"
            className="cook-order-icon-btn cook-order-back-btn"
            onClick={onBack}
            aria-label="Back to suggestion"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#183d2c"
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
            className="cook-order-icon-btn cook-order-bookmark-btn"
            onClick={handleToggleSave}
            aria-label={isSaved ? 'Remove from saved' : 'Save dish'}
            title={isSaved ? 'Dish saved' : 'Save dish'}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill={isSaved ? '#183d2c' : 'none'}
              stroke="#183d2c"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </header>

        {/* Dish Summary Header */}
        <div className="cook-order-dish-header">
          {/* Circular Graphic Avatar Badge */}
          <div className="cook-order-avatar-container" aria-hidden="true">
            <svg
              className="cook-order-avatar-svg"
              viewBox="0 0 170 170"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer teal-green ring */}
              <circle cx="85" cy="85" r="82" fill="#25513f" />

              {/* Middle crisp white ring */}
              <circle cx="85" cy="85" r="68" fill="#ffffff" />

              {/* Inner warm apricot/gold circle */}
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

          {/* Dish Title & Meta Info */}
          <div className="cook-order-dish-meta">
            <h1 className="cook-order-dish-title">{activeDish.name}</h1>

            <div className="cook-order-meta-row">
              {/* Diet symbol (green square with dot for veg) */}
              <span
                className={`cook-order-diet-mark ${
                  activeDish.dietType === 'non-veg' || activeDish.id?.startsWith('nv')
                    ? 'cook-order-diet-nonveg'
                    : activeDish.dietType === 'egg' || activeDish.id?.startsWith('e')
                      ? 'cook-order-diet-egg'
                      : 'cook-order-diet-veg'
                }`}
                title={dietLabel}
                aria-label={dietLabel}
              >
                <span className="cook-order-diet-dot" />
              </span>

              <span className="cook-order-meta-text">
                {`${dietLabel} · ${moodLabel} · ${regionLabel}`}
              </span>
            </div>
          </div>
        </div>

        {/* Segmented Control Pill: Order in | Cook it */}
        <div className="cook-order-tabs-container" role="tablist" aria-label="Order or cook choice">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'order'}
            className={`cook-order-tab-btn ${activeTab === 'order' ? 'active' : ''}`}
            onClick={() => setActiveTab('order')}
          >
            Order in
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'cook'}
            className={`cook-order-tab-btn ${activeTab === 'cook' ? 'active' : ''}`}
            onClick={() => setActiveTab('cook')}
          >
            Cook it
          </button>
        </div>

        {/* Tab Content: Order in */}
        {activeTab === 'order' && (
          <div className="cook-order-content" role="tabpanel" aria-label="Order options">
            <h2 className="cook-order-section-title">Pick an app to order from</h2>

            {/* Delivery App Card A */}
            <button
              type="button"
              className="cook-order-app-card"
              onClick={() => handleOpenApp('appA')}
              aria-label="Order on [Delivery app A]"
            >
              <div className="cook-order-app-left">
                <div className="cook-order-app-icon-box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#183d2c"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>

                <div className="cook-order-app-info">
                  <span className="cook-order-app-name">[Delivery app A]</span>
                  <span className="cook-order-app-sub">
                    {`${timeDisplay} · ${priceDisplay}`}
                  </span>
                </div>
              </div>

              <div className="cook-order-app-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#183d2c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </button>

            {/* Delivery App Card B */}
            <button
              type="button"
              className="cook-order-app-card"
              onClick={() => handleOpenApp('appB')}
              aria-label="Order on [Delivery app B]"
            >
              <div className="cook-order-app-left">
                <div className="cook-order-app-icon-box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#183d2c"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <path d="M16 10a4 4 0 0 1-8 0" />
                  </svg>
                </div>

                <div className="cook-order-app-info">
                  <span className="cook-order-app-name">[Delivery app B]</span>
                  <span className="cook-order-app-sub">
                    {`${timeDisplay} · ${priceDisplay}`}
                  </span>
                </div>
              </div>

              <div className="cook-order-app-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#183d2c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Tab Content: Cook it */}
        {activeTab === 'cook' && (
          <div className="cook-order-content" role="tabpanel" aria-label="Cook options">
            <h2 className="cook-order-section-title">Pick a guide to cook from</h2>

            {/* Recipe Video Guide Card */}
            <button
              type="button"
              className="cook-order-app-card"
              onClick={() => handleOpenApp('youtube')}
              aria-label="Watch video recipe on YouTube"
            >
              <div className="cook-order-app-left">
                <div className="cook-order-app-icon-box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#183d2c"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>

                <div className="cook-order-app-info">
                  <span className="cook-order-app-name">YouTube Recipe Guide</span>
                  <span className="cook-order-app-sub">
                    {`${timeDisplay} · Video walkthrough`}
                  </span>
                </div>
              </div>

              <div className="cook-order-app-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#183d2c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </button>

            {/* Step-by-Step Recipe Card */}
            <button
              type="button"
              className="cook-order-app-card"
              onClick={() => handleOpenApp('google')}
              aria-label="View step-by-step recipe on Google"
            >
              <div className="cook-order-app-left">
                <div className="cook-order-app-icon-box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#183d2c"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>

                <div className="cook-order-app-info">
                  <span className="cook-order-app-name">Step-by-step Recipe</span>
                  <span className="cook-order-app-sub">
                    {`${timeDisplay} · Ingredients & steps`}
                  </span>
                </div>
              </div>

              <div className="cook-order-app-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#183d2c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </button>

            {/* Quick Ingredients Grocery Card */}
            <button
              type="button"
              className="cook-order-app-card"
              onClick={() => handleOpenApp('grocery')}
              aria-label="Order raw ingredients"
            >
              <div className="cook-order-app-left">
                <div className="cook-order-app-icon-box" aria-hidden="true">
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#183d2c"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                </div>

                <div className="cook-order-app-info">
                  <span className="cook-order-app-name">Get ingredients</span>
                  <span className="cook-order-app-sub">
                    About 10 min · Instant delivery
                  </span>
                </div>
              </div>

              <div className="cook-order-app-arrow" aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#183d2c"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </button>
          </div>
        )}

        {/* Callout Card: SEARCH FOR */}
        <div className="cook-order-search-card">
          <div className="cook-order-search-label">SEARCH FOR</div>

          <div className="cook-order-search-row">
            <span className="cook-order-search-term">{currentSearchTerm}</span>

            <button
              type="button"
              className={`cook-order-copy-btn ${copied ? 'copied' : ''}`}
              onClick={handleCopySearch}
              title="Copy search query"
            >
              {copied ? 'Copied ✓' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <footer className="cook-order-footer">
          <p className="cook-order-footer-text">
            Cravly doesn't take orders. You'll finish in the app you pick.
          </p>
        </footer>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="cook-order-toast" role="status" aria-live="polite">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
