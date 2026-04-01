import { useState, useEffect } from 'react';
import Header from './components/Header';
import InputScreen from './screens/InputScreen';
import SuggestionScreen from './screens/SuggestionScreen';
import { getMealTime } from './utils/timeUtils';
import { getMultipleRecommendations, resetShownDishes } from './utils/recommendationEngine';
import './App.css';

function App() {
  // State
  const [screen, setScreen] = useState('input'); // 'input' | 'suggestion'
  const [dietType, setDietType] = useState('veg');
  const [mode, setMode] = useState('order'); // 'order' (Buy) | 'cook' (Cook)
  const [currentDishes, setCurrentDishes] = useState([]);
  const [mealTime, setMealTime] = useState(getMealTime());
  const [manualMealOverride, setManualMealOverride] = useState(null);
  
  // Theme State
  const [theme, setTheme] = useState(() => {
    // Check if we are running in browser and detect preference
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Fallback
  });

  // Apply theme class to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Update meal time periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setMealTime(getMealTime());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // Handle getting a recommendation
  const handleFeedMe = () => {
    const finalMealTime = manualMealOverride || mealTime;
    const dishes = getMultipleRecommendations(dietType, mode, finalMealTime, 3);
    setCurrentDishes(dishes);
    setScreen('suggestion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Deep Randomization for "Surprise Me"
  const handleSurpriseMe = () => {
    const diets = ['veg', 'non-veg', 'egg'];
    const modes = ['order', 'cook'];
    const mealTimes = ['breakfast', 'lunch', 'snacks', 'dinner', 'late-night'];
    
    const randomDiet = diets[Math.floor(Math.random() * diets.length)];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomMeal = mealTimes[Math.floor(Math.random() * mealTimes.length)];
    
    setDietType(randomDiet);
    setMode(randomMode);
    setManualMealOverride(randomMeal);
    
    const dishes = getMultipleRecommendations(randomDiet, randomMode, randomMeal, 3);
    setCurrentDishes(dishes);
    setScreen('suggestion');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle shuffle (Rotate options)
  const handleShuffle = () => {
    if (currentDishes.length > 1) {
      const rotated = [...currentDishes.slice(1), currentDishes[0]];
      setCurrentDishes(rotated);
    }
  };

  // Handle selecting a specific dish from alternates
  const handleSelect = (index) => {
    if (index === 0) return;
    const newOrder = [...currentDishes.slice(index), ...currentDishes.slice(0, index)];
    setCurrentDishes(newOrder);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle going back
  const handleBack = () => {
    setScreen('input');
    resetShownDishes();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header 
        onSurpriseMe={handleSurpriseMe} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />
      
      <div className="screen-container">
        {screen === 'input' ? (
          <InputScreen
            dietType={dietType}
            setDietType={setDietType}
            mode={mode}
            setMode={setMode}
            onFeedMe={handleFeedMe}
            mealTime={manualMealOverride || mealTime}
            setMealTime={setManualMealOverride}
          />
        ) : (
          <SuggestionScreen
            dish={currentDishes[0]}
            suggestions={currentDishes}
            mode={mode}
            onBack={handleBack}
            onShuffle={handleShuffle}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
}

export default App;
