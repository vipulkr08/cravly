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
                <span className="back-link" onClick={onBack}>
                    ← Back to Preferences
                </span>

                <div className="dish-card-minimal">
                    <span className="dish-label-minimal">{mode === 'order' ? 'Featured Selection' : 'Editor\'s Choice'}</span>
                    <h1 className="dish-title-minimal">
                        <span className={`diet-indicator ${dish.id.startsWith('v') ? 'veg' : dish.id.startsWith('nv') ? 'non-veg' : 'egg'}`}></span>
                        {dish.name}
                    </h1>
                    
                    <div className="dish-reason-block">
                        "Chef's Note: {dish.why}"
                    </div>

                    <p className="dish-desc-minimal">
                        {dish.description}
                    </p>

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

                    <div className="action-row">
                        <button className="btn-secondary-simple" onClick={handlePrimaryAction}>
                            {mode === 'order' ? 'Find on Swiggy' : 'Recipe on YouTube'}
                        </button>
                        <button className="shuffle-minimal" onClick={onShuffle} title="Try another match">
                            🎲
                        </button>
                    </div>
                </div>

                {/* Alternates Panel - Text Only */}
                {suggestions && suggestions.length > 1 && (
                    <div style={{ marginTop: '40px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', marginBottom: '16px', color: '#888' }}>OTHER SUGGESTIONS</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {suggestions.slice(1).map((item, index) => (
                                <div 
                                    key={item.id} 
                                    onClick={() => onSelect(index + 1)}
                                    style={{ 
                                        padding: '12px', 
                                        border: '1px solid #E9ECEF', 
                                        borderRadius: '4px', 
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <span style={{ fontSize: '13px', fontWeight: '700' }}>{item.name}</span>
                                    <span style={{ fontSize: '11px', color: '#888' }}>{item.time || '15m'}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <footer className="minimal-footer">
                <p className="footer-text">© 2026 Cravely. Purely functional discovery.</p>
            </footer>
        </div>
    );
}

export default SuggestionScreen;
