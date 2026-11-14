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
import PreferencesScreen from './screens/PreferencesScreen';
import FindingScreen from './screens/FindingScreen';
import InputScreen from './screens/InputScreen';
import SuggestionScreen from './screens/SuggestionScreen';
import CookOrOrderScreen from './screens/CookOrOrderScreen';

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
    lastFilters,
    handleGetStarted,
    handleBackToWelcome,
    handleMoodPicks,
    handleMatchMeal,
    handleCompleteFinding,
    handleBackToMood,
    handleFeedMe,
    handleSurpriseMe,
    handleShuffle,
    handleSelect,
    handleCookOrOrder,
    handleBackToSuggestion,
    handleBack,
  } = useRecommendations({ dietType, setDietType, mode, setMode, mealTime, setMealTime });

  // Handle browser back button
  useEffect(() => {
    const onPopState = (e) => {
      if (!e.state || e.state.screen === 'welcome') {
        handleBackToWelcome();
      } else if (e.state.screen === 'mood') {
        setScreen('mood');
      } else if (e.state.screen === 'preferences' || e.state.screen === 'input') {
        setScreen('preferences');
      } else if (e.state.screen === 'finding') {
        setScreen('finding');
      } else if (e.state.screen === 'suggestion') {
        setScreen('suggestion');
      } else if (e.state.screen === 'cook-or-order') {
        setScreen('cook-or-order');
      } else {
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

  // ── Mood Selection Screen (Step 1) ────────────────────────────────────────
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

  // ── Quick Taps / Preferences Screen (Step 2 of 3) ─────────────────────────
  if (screen === 'preferences' || screen === 'input') {
    return (
      <PreferencesScreen
        selectedMood={selectedMood}
        initialMode={mode}
        initialDiet={dietType}
        onBack={handleBackToMood}
        onMatchMeal={handleMatchMeal}
      />
    );
  }

  // ── Finding / Matching Screen (Step 3 of 3) ───────────────────────────────
  if (screen === 'finding') {
    return (
      <FindingScreen
        selectedMood={selectedMood}
        onComplete={handleCompleteFinding}
        onLogoClick={handleBackToWelcome}
      />
    );
  }

  // ── Match / Suggestion Screen ─────────────────────────────────────────────
  if (screen === 'suggestion') {
    return (
      <SuggestionScreen
        dish={currentDishes[0]}
        suggestions={currentDishes}
        selectedMood={selectedMood}
        dietType={dietType}
        mode={mode}
        budget={lastFilters?.budget}
        onBack={handleBack}
        onLogoClick={handleBackToWelcome}
        onShuffle={handleShuffle}
        onSelect={handleSelect}
        onOrderOrCook={handleCookOrOrder}
      />
    );
  }

  // ── Cook or Order Screen ──────────────────────────────────────────────────
  if (screen === 'cook-or-order' || screen === 'order-or-cook') {
    return (
      <CookOrOrderScreen
        dish={currentDishes[0]}
        selectedMood={selectedMood}
        dietType={dietType}
        initialMode={mode}
        onBack={handleBackToSuggestion}
      />
    );
  }

  // ── Fallback App Shell (Legacy input) ─────────────────────────────────────
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
      </div>

      <footer className="minimal-footer">
        <p className="footer-text">© 2026 Cravly. Purely functional discovery.</p>
      </footer>
    </div>
  );
}

export default App;
