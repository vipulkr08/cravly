import { useState, useEffect } from 'react';
import { getMealTimeDisplay } from '../utils/timeUtils';
import { getSwiggyUrl, getZomatoUrl, getYouTubeUrl } from '../utils/recommendationEngine';

function SuggestionScreen({ dish, mode, onBack, onShuffle, onModeChange }) {
    const [isFlipping, setIsFlipping] = useState(false);

    // Reset flipping state when dish changes
    useEffect(() => {
        setIsFlipping(false);
    }, [dish]);

    const handleShuffleClick = () => {
        setIsFlipping(true);
        onShuffle();
    };

    const handlePrimaryAction = () => {
        if (mode === 'order') {
            window.open(getSwiggyUrl(dish.searchTerm), '_blank', 'noopener,noreferrer');
        } else {
            window.open(getYouTubeUrl(dish.searchTerm), '_blank', 'noopener,noreferrer');
        }
    };

    if (!dish) {
        return (
            <div className="result-screen error-screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div className="glass-content-card" style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🙈</div>
                    <h2 style={{ color: 'white', marginBottom: 8 }}>Empty Plate!</h2>
                    <p style={{ color: '#aaa', marginBottom: 24 }}>
                        We couldn't find a perfect match for this combo.
                    </p>
                    <button className="primary-action-btn" onClick={onBack} style={{ width: '100%', justifyContent: 'center' }}>
                        Try Something Else
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="result-screen">
            {/* Bleed Background Image */}
            <div className="hero-bleed-image">
                <img src={dish.image} alt="" role="presentation" />
                <div className="bleed-overlay"></div>
            </div>

            {/* Content Layer */}
            <div className={`result-content ${isFlipping ? 'flipping' : ''}`}>

                {/* Floating "Why" Badge - Now on the image */}
                <div className="floating-badge">
                    <span className="badge-icon">✨</span>
                    <span className="badge-text">{dish.why}</span>
                </div>

                {/* Back Navigation */}
                <button className="back-nav-btn" onClick={onBack}>
                    ← Back
                </button>

                {/* Main Glass Card */}
                <div className="glass-content-card">
                    <div className="card-header">
                        <span className={`diet-tag ${dish.dietType}`}>{dish.dietType}</span>
                        {dish.price && <span className="price-tag">{dish.price}</span>}
                    </div>

                    <h1 className="dish-title">{dish.name}</h1>
                    <p className="dish-description">{dish.description}</p>

                    {/* Decision Engine Stats */}
                    <div className="quick-stats">
                        <div className="stat-item">
                            <span className="stat-icon">⏱️</span>
                            <span className="stat-text">{dish.time || '20 mins'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-icon">🔥</span>
                            <span className="stat-text">{dish.calories || '350 kcal'}</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-icon">🌶️</span>
                            <span className="stat-text">{dish.spiceLevel || 'Medium'}</span>
                        </div>
                    </div>

                    <div className="divider-line"></div>

                    {/* Contextual & Trending */}
                    {dish.restaurants && (
                        <div className="trending-section">
                            <p className="trending-label">� Trending in Indiranagar & Koramangala</p>
                            <div className="best-places-row">
                                {dish.restaurants.slice(0, 3).map((place, i) => (
                                    <span key={i} className="place-pill">{place}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Unified Action Tray */}
                <div className="action-tray">
                    <button className="primary-action-btn" onClick={handlePrimaryAction}>
                        <span>{mode === 'order' ? 'Order on Swiggy' : 'Watch Recipe'}</span>
                        <span className="action-arrow">→</span>
                    </button>

                    <button className="shuffle-fab" onClick={handleShuffleClick} aria-label="Shuffle">
                        <span className="shuffle-icon">🎲</span>
                    </button>
                </div>

                {/* Alternates Panel - Only if we have more suggestions */}
                {dish && suggestions && suggestions.length > 1 && (
                    <div className="alternates-panel">
                        <p className="alternates-label">More Cravings</p>
                        <div className="alternates-list">
                            {suggestions.slice(1).map((item, index) => (
                                <div
                                    key={item.id}
                                    className="alternate-card"
                                    onClick={() => onSelect && onSelect(index + 1)}
                                >
                                    <img src={item.image} alt={item.name} className="alt-img" />
                                    <div className="alt-info">
                                        <span className="alt-name">{item.name}</span>
                                        <span className="alt-time">{item.time || '20m'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SuggestionScreen;
