import { useState, useEffect } from 'react';
import InputScreen from './screens/InputScreen';
import SuggestionScreen from './screens/SuggestionScreen';
import { getMealTime } from './utils/timeUtils';
import { getRecommendation, shuffleRecommendation, resetShownDishes, getMultipleRecommendations } from './utils/recommendationEngine';
import './App.css';

function App() {
  // State
  const [screen, setScreen] = useState('input'); // 'input' | 'suggestion'
  const [dietType, setDietType] = useState('veg');
  const [mode, setMode] = useState('order');
  const [currentDishes, setCurrentDishes] = useState([]);
  const [mealTime, setMealTime] = useState(getMealTime());
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Update meal time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMealTime(getMealTime());
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  // Handle getting a recommendation
  const handleFeedMe = () => {
    // Show suggestion screen immediately
    setScreen('suggestion');
    setIsTransitioning(false);

    // Calculate recommendation and show immediately
    const dishes = getMultipleRecommendations(dietType, mode, mealTime, 3);
    setCurrentDishes(dishes);
  };

  // Handle shuffle (Rotate options)
  const handleShuffle = () => {
    if (currentDishes.length > 1) {
      // Rotate the array: Move first to last
      const rotated = [...currentDishes.slice(1), currentDishes[0]];
      setCurrentDishes(rotated);
    } else {
      // Fallback if only 1 dish available
      const dish = shuffleRecommendation(dietType, mode, currentDishes[0]?.id);
      setCurrentDishes([dish]);
    }
  };

  // Handle selecting a specific dish from alternates
  const handleSelect = (index) => {
    if (index === 0) return; // Already selected
    const newOrder = [...currentDishes.slice(index), ...currentDishes.slice(0, index)];
    setCurrentDishes(newOrder);
  };

  // Handle going back
  const handleBack = () => {
    setIsTransitioning(true);

    setTimeout(() => {
      setScreen('input');
      setIsTransitioning(false);
      resetShownDishes();
    }, 300);
  };

  // Handle mode change from suggestion screen
  const handleModeChange = (newMode) => {
    setMode(newMode);
    const dish = getRecommendation(dietType, newMode, mealTime);
    // For simplicity, just get one new dish or re-fetch multiples
    const dishes = getMultipleRecommendations(dietType, newMode, mealTime, 3);
    setCurrentDishes(dishes);
  };

  return (
    <div className="app">
      <div className={`screen-container ${isTransitioning ? 'transitioning' : ''}`}>
        {screen === 'input' ? (
          <InputScreen
            dietType={dietType}
            setDietType={setDietType}
            mode={mode}
            setMode={setMode}
            mealTime={mealTime}
            onFeedMe={handleFeedMe}
          />
        ) : (
          <SuggestionScreen
            dish={currentDishes[0]}
            suggestions={currentDishes}
            mode={mode}
            onBack={handleBack}
            onShuffle={handleShuffle}
            onSelect={handleSelect}
            onModeChange={handleModeChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;
