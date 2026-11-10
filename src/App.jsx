/**
 * App.jsx — Layout shell only.
 * Coordinates screens: Welcome -> Mood Selection -> Suggestions
 */
import { useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import { usePreferences } from './hooks/usePreferences';
import { useMealTime } from './hooks/useMealTime';
import { useRecommendations } from './hooks/useRecommendations';

import Header from './components/Header';
import WelcomeScreen from './screens/WelcomeScreen';
import MoodScreen from './screens/MoodScreen';
import InputScreen from './screens/InputScreen';
import SuggestionScreen from './screens/SuggestionScreen';

import './App.css';

function App() {
  const { theme, toggleTheme } = useAppContext();
  const { dietType, setDietType, mode, setMode } = usePreferences();
  const { mealTime, setMealTime } = useMealTime();
  const {
    screen,
    setScreen,
    selectedMood,
    setSelectedMood,
    city,
    setCity,
    currentDishes,
    handleGetStarted,
    handleBackToWelcome,
    handleMoodPicks,
    handleFeedMe,
    handleSurpriseMe,
    handleShuffle,
    handleSelect,
    handleBack,
  } = useRecommendations({ dietType, setDietType, mode, setMode, mealTime, setMealTime });

  // Handle browser back button
  useEffect(() => {
    const onPopState = (e) => {
      if (!e.state || e.state.screen === 'welcome') {
        handleBackToWelcome();
      } else if (e.state.screen === 'mood') {
        setScreen('mood');
      } else if (e.state.screen !== 'suggestion') {
        handleBack();
      }
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [handleBack, handleBackToWelcome, setScreen]);

  // ── Welcome Screen ────────────────────────────────────────────────────────
  if (screen === 'welcome') {
    return (
      <WelcomeScreen
        onGetStarted={handleGetStarted}
        onLogin={handleGetStarted}
      />
    );
  }

  // ── Mood Selection Screen ─────────────────────────────────────────────────
  if (screen === 'mood') {
    return (
      <MoodScreen
        selectedMood={selectedMood}
        onSelectMood={setSelectedMood}
        onShowPicks={handleMoodPicks}
        onLogoClick={handleBackToWelcome}
        mode={mode}
        onToggleMode={setMode}
        city={city}
        onChangeCity={setCity}
        dietType={dietType}
        onChangeDiet={setDietType}
      />
    );
  }

  // ── Main App Shell (Suggestions & legacy input) ───────────────────────────
  return (
    <div className="app">
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        onSurpriseMe={handleSurpriseMe}
        onLogoClick={handleBack}
      />

      <div className="screen-container">
        {screen === 'input' && (
          <InputScreen
            dietType={dietType}
            setDietType={setDietType}
            mode={mode}
            setMode={setMode}
            mealTime={mealTime}
            setMealTime={setMealTime}
            onFeedMe={handleFeedMe}
          />
        )}

        {screen === 'suggestion' && (
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
