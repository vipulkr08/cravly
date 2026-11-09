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
                    Because deciding what to eat shouldn't take longer than eating it. Cravly pairs your mood with curated meal recommendations across Bengaluru.
                </p>

                <div className="selection-stack">
                    {/* Mode Toggle */}
                    <div>
                        <p className="group-label">I want to...</p>
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
                    </div>

                    {/* Meal Time Pills */}
                    <div>
                        <p className="group-label">Right now it's...</p>
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
                    </div>

                    {/* Diet Pills */}
                    <div>
                        <p className="group-label">My preference</p>
                        <div className="diet-pills">
                            <div 
                                className={`diet-pill ${dietType === 'veg' ? 'active' : ''}`}
                                onClick={() => setDietType('veg')}
                            >
                                <span className="diet-indicator veg" style={{width:'6px',height:'6px',display:'inline-block',borderRadius:'50%',marginRight:'6px'}}></span>
                                Veg
                            </div>
                            <div 
                                className={`diet-pill ${dietType === 'non-veg' ? 'active' : ''}`}
                                onClick={() => setDietType('non-veg')}
                            >
                                <span className="diet-indicator non-veg" style={{width:'6px',height:'6px',display:'inline-block',borderRadius:'50%',marginRight:'6px'}}></span>
                                Non-Veg
                            </div>
                            <div 
                                className={`diet-pill ${dietType === 'egg' ? 'active' : ''}`}
                                onClick={() => setDietType('egg')}
                            >
                                <span className="diet-indicator egg" style={{width:'6px',height:'6px',display:'inline-block',borderRadius:'50%',marginRight:'6px'}}></span>
                                Egg
                            </div>
                        </div>
                    </div>
                </div>

                <button className="btn-primary-simple" onClick={onFeedMe}>
                    Feed Me
                </button>
            </main>
        </div>
    );
}

export default InputScreen;
