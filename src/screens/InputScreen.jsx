import React from 'react';

function InputScreen({ dietType, setDietType, mode, setMode, onFeedMe, mealTime, setMealTime }) {
    
    // UI Helpers
    const mealLabels = {
        'breakfast': 'Breakfast',
        'lunch': 'Lunch',
        'snacks': 'Snacks',
        'dinner': 'Dinner',
        'late-night': 'Late Night'
    };

    return (
        <div className="landing-screen animate-in">
            <main>
                <h1 className="title-hero">What should I eat?</h1>
                <p className="desc-hero">
                    A simple tool to help you decide your next meal. 
                    Choose your mode and dietary preference to begin.
                </p>

                <div className="selection-stack">
                    {/* Mode Toggle */}
                    <div className="toggle-simple">
                        <div 
                            className={`toggle-simple-item ${mode === 'cook' ? 'active' : ''}`}
                            onClick={() => setMode('cook')}
                        >
                            Cook
                        </div>
                        <div 
                            className={`toggle-simple-item ${mode === 'order' ? 'active' : ''}`}
                            onClick={() => setMode('order')}
                        >
                            Buy
                        </div>
                    </div>

                    {/* Meal Time Pills */}
                    <div className="diet-pills">
                        {Object.keys(mealLabels).map((time) => (
                            <div 
                                key={time}
                                className={`diet-pill ${mealTime === time ? 'active' : ''}`}
                                onClick={() => setMealTime(time)}
                            >
                                {mealLabels[time]}
                            </div>
                        ))}
                    </div>

                    {/* Diet Pills */}
                    <div className="diet-pills">
                        <div 
                            className={`diet-pill ${dietType === 'veg' ? 'active' : ''}`}
                            onClick={() => setDietType('veg')}
                        >
                            Veg
                        </div>
                        <div 
                            className={`diet-pill ${dietType === 'non-veg' ? 'active' : ''}`}
                            onClick={() => setDietType('non-veg')}
                        >
                            Non-Veg
                        </div>
                        <div 
                            className={`diet-pill ${dietType === 'egg' ? 'active' : ''}`}
                            onClick={() => setDietType('egg')}
                        >
                            Egg
                        </div>
                    </div>
                </div>

                <button className="btn-primary-simple" onClick={onFeedMe}>
                    Find My Match
                </button>
            </main>

            <footer className="minimal-footer">
                <p className="footer-text">© 2026 Cravely. Purely functional.</p>
            </footer>
        </div>
    );
}

export default InputScreen;
