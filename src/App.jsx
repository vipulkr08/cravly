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
  const [dietType, setDietType] = useState(() => localStorage.getItem('cravly-diet') || 'veg');
  const [mode, setMode] = useState(() => localStorage.getItem('cravly-mode') || 'order'); 
  const [currentDishes, setCurrentDishes] = useState([]);
  const [mealTime, setMealTime] = useState(getMealTime());
  const [manualMealOverride, setManualMealOverride] = useState(null);
  const [initialPrefs, setInitialPrefs] = useState(null); // Backup for "Surprise Me"
  
  // Theme State (persisted)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('cravly-theme');
    if (saved) return saved;
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // Apply theme class to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cravly-theme', theme);
  }, [theme]);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('cravly-diet', dietType);
    localStorage.setItem('cravly-mode', mode);
  }, [dietType, mode]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Handle browser back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state && event.state.screen === 'suggestion') {
        setScreen('suggestion');
      } else {
        setScreen('input');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

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
    window.history.pushState({ screen: 'suggestion' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Deep Randomization for "Surprise Me"
  const handleSurpriseMe = () => {
    // Store current state so we can restore it later
    setInitialPrefs({ dietType, mode, manualMealOverride });

    const diets = ['veg', 'non-veg', 'egg'];
    const modes = ['order', 'cook'];
    const mealTimes = ['breakfast', 'lunch', 'snacks', 'dinner', 'late-night'];
    
    // Most users want surprise to respect their diet
    // If they haven't changed from 'veg', we'll still treat it as a preference
    const targetDiet = dietType || diets[Math.floor(Math.random() * diets.length)];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    const randomMeal = mealTimes[Math.floor(Math.random() * mealTimes.length)];
    
    setDietType(targetDiet);
    setMode(randomMode);
    setManualMealOverride(randomMeal);
    
    const dishes = getMultipleRecommendations(targetDiet, randomMode, randomMeal, 3);
    setCurrentDishes(dishes);
    setScreen('suggestion');
    window.history.pushState({ screen: 'suggestion' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle shuffle (Fetch fresh recommendations)
  const handleShuffle = () => {
    const finalMealTime = manualMealOverride || mealTime;
    const dishes = getMultipleRecommendations(dietType, mode, finalMealTime, 3);
    setCurrentDishes(dishes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Restore initial preferences if we were in "Surprise Me" mode
    if (initialPrefs) {
      setDietType(initialPrefs.dietType);
      setMode(initialPrefs.mode);
      setManualMealOverride(initialPrefs.manualMealOverride);
      setInitialPrefs(null);
    }
    
    setScreen('input');
    resetShownDishes();
    if (window.history.state && window.history.state.screen === 'suggestion') {
      window.history.back();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="app">
      <Header 
        onSurpriseMe={handleSurpriseMe} 
        theme={theme} 
        toggleTheme={toggleTheme}
        onLogoClick={handleBack}
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

      <footer className="minimal-footer">
        <p className="footer-text">© 2026 Cravly. Purely functional discovery.</p>
      </footer>
    </div>
  );
}

export default App;
