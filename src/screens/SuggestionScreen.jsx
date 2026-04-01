import React from 'react';
import { getSwiggyUrl, getYouTubeUrl } from '../utils/recommendationEngine';

function SuggestionScreen({ dish, suggestions, mode, onBack, onShuffle, onSelect }) {
    
    const handlePrimaryAction = () => {
        const url = mode === 'order' ? getSwiggyUrl(dish.searchTerm) : getYouTubeUrl(dish.searchTerm);
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    if (!dish) return null;

    return (
        <div className="result-screen-minimal animate-in">
            <main>
                <div className="dish-card-minimal">
                    <span className="dish-label-minimal">{mode === 'order' ? 'Featured Selection' : 'Editor\'s Choice'}</span>
                    <h1 className="dish-title-minimal">
                        <span className={`diet-indicator ${dish.id.startsWith('v') ? 'veg' : dish.id.startsWith('nv') ? 'non-veg' : 'egg'}`}></span>
                        {dish.name}
                    </h1>

                    <div className="dish-stats-minimal">
                        <div className="stat-item-minimal">
                            PREPARATION
                            <span>{dish.time || '20 mins'}</span>
                        </div>
                        <div className="stat-item-minimal">
                            ENERGY
                            <span>{dish.calories || '450 kcal'}</span>
                        </div>
                        <div className="stat-item-minimal">
                            SPICE
                            <span>{dish.spiceLevel || 'Medium'}</span>
                        </div>
                    </div>

                    <p className="dish-desc-minimal">
                        {dish.description}
                    </p>

                    <div className="dish-reason-block">
                        "{dish.why}"
                    </div>

                    <div className="action-row">
                        <button className="btn-secondary-simple" onClick={handlePrimaryAction}>
                            {mode === 'order' ? 'Find on Swiggy' : 'Recipe on YouTube'}
                        </button>
                        <button className="shuffle-minimal" onClick={onShuffle} title="Try another match">
                            Next
                        </button>
                    </div>
                </div>

                {/* Alternates Panel - Theme Aware */}
                {suggestions && suggestions.length > 1 && (
                    <div className="alt-section">
                        <h3 className="alt-section-title">OTHER SUGGESTIONS</h3>
                        <div className="alt-list">
                            {suggestions.slice(1).map((item, index) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => onSelect(index + 1)}
                                    className="alt-item"
                                >
                                    <span className="alt-item-name">{item.name}</span>
                                    <span className="alt-item-time">{item.time || '15m'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default SuggestionScreen;
