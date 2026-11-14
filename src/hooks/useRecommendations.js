/**
 * useRecommendations — owns currentDishes[], screen transitions,
 *                      mood selection, and all recommendation actions.
 */
import { useState, useCallback } from 'react';
import {
  getMultipleRecommendations,
  getRecommendationsForMood,
  resetShownDishes,
} from '../utils/recommendationEngine';

const MEAL_TIMES = ['breakfast', 'lunch', 'snacks', 'dinner', 'late-night'];
const DIETS      = ['veg', 'non-veg', 'egg'];
const MODES      = ['order', 'cook'];

const getInitialScreen = () => {
  if (typeof window !== 'undefined') {
    const params = new URLSearchParams(window.location.search);
    if (params.get('screen') === 'cook-or-order' || params.get('screen') === 'order-or-cook') return 'cook-or-order';
    if (params.get('screen') === 'finding' || params.get('screen') === 'step3' || params.get('screen') === 'matching') return 'finding';
    if (params.get('screen') === 'preferences' || params.get('screen') === 'step2' || params.get('screen') === 'input') return 'preferences';
    if (params.get('screen') === 'mood') return 'mood';
    if (params.get('screen') === 'suggestion') return 'suggestion';
    if (window.location.hash === '#cook-or-order' || window.location.hash === '#order-or-cook') return 'cook-or-order';
    if (window.location.hash === '#finding' || window.location.hash === '#step3') return 'finding';
    if (window.location.hash === '#mood') return 'mood';
    if (window.location.hash === '#preferences' || window.location.hash === '#step2') return 'preferences';
    if (window.location.hash === '#suggestion') return 'suggestion';
  }
  return 'welcome';
};

export function useRecommendations({ dietType, setDietType, mode, setMode, mealTime, setMealTime }) {
  const [screen, setScreen] = useState(getInitialScreen); // 'welcome' | 'mood' | 'preferences' | 'input' | 'suggestion'
  const [selectedMood, setSelectedMood] = useState('cosy');
  const [city, setCity] = useState('Bengaluru');
  const [currentDishes, setCurrentDishes] = useState([]);
  const [savedPrefs, setSavedPrefs] = useState(null); // for Surprise Me restore
  const [lastFilters, setLastFilters] = useState({});

  // ── Helpers ───────────────────────────────────────────────────────────────
  const pushToSuggestion = useCallback((dishes) => {
    setCurrentDishes(dishes);
    setScreen('suggestion');
    window.history.pushState({ screen: 'suggestion' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────
  const handleGetStarted = useCallback(() => {
    setScreen('mood');
    window.history.pushState({ screen: 'mood' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBackToWelcome = useCallback(() => {
    setScreen('welcome');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleMoodPicks = useCallback((mood = 'cosy', customMode = null) => {
    setSelectedMood(mood);
    if (customMode && customMode !== mode) {
      setMode(customMode);
    }
    setScreen('preferences');
    window.history.pushState({ screen: 'preferences' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mode, setMode]);

  const handleMatchMeal = useCallback(({
    mood = selectedMood,
    mode: newMode,
    hunger,
    time,
    dietType: newDiet,
    budget
  } = {}) => {
    const activeMood = mood || selectedMood;
    const activeMode = newMode || mode;
    const activeDiet = newDiet || dietType;

    if (activeMode && activeMode !== mode) setMode(activeMode);
    if (activeDiet && activeDiet !== dietType) setDietType(activeDiet);

    const filterOptions = { hunger, time, budget };
    setLastFilters(filterOptions);

    const dishes = getRecommendationsForMood(
      activeMood,
      activeDiet,
      activeMode,
      mealTime,
      3,
      filterOptions
    );
    setCurrentDishes(dishes);
    setScreen('finding');
    window.history.pushState({ screen: 'finding' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedMood, mode, dietType, mealTime, setMode, setDietType]);

  const handleCompleteFinding = useCallback(() => {
    setCurrentDishes((prev) => {
      if (prev && prev.length > 0) return prev;
      return getRecommendationsForMood(
        selectedMood,
        dietType,
        mode,
        mealTime,
        3,
        lastFilters
      );
    });
    setScreen('suggestion');
    window.history.pushState({ screen: 'suggestion' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedMood, dietType, mode, mealTime, lastFilters]);

  const handleBackToMood = useCallback(() => {
    setScreen('mood');
    window.history.pushState({ screen: 'mood' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleFeedMe = useCallback(() => {
    const dishes = getMultipleRecommendations(dietType, mode, mealTime, 3);
    pushToSuggestion(dishes);
  }, [dietType, mode, mealTime, pushToSuggestion]);

  const handleSurpriseMe = useCallback(() => {
    setSavedPrefs({ dietType, mode, mealTime });

    const randomDiet     = DIETS[Math.floor(Math.random() * DIETS.length)];
    const randomMode     = MODES[Math.floor(Math.random() * MODES.length)];
    const randomMealTime = MEAL_TIMES[Math.floor(Math.random() * MEAL_TIMES.length)];

    setDietType(randomDiet);
    setMode(randomMode);
    setMealTime(randomMealTime);

    const dishes = getMultipleRecommendations(randomDiet, randomMode, randomMealTime, 3);
    pushToSuggestion(dishes);
  }, [dietType, mode, mealTime, setDietType, setMode, setMealTime, pushToSuggestion]);

  const handleShuffle = useCallback(() => {
    const dishes = getRecommendationsForMood(selectedMood, dietType, mode, mealTime, 3, lastFilters);
    setCurrentDishes(dishes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedMood, dietType, mode, mealTime, lastFilters]);

  const handleSelect = useCallback((index) => {
    if (index === 0) return;
    setCurrentDishes(prev => [...prev.slice(index), ...prev.slice(0, index)]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCookOrOrder = useCallback((dish, customMode) => {
    if (customMode && customMode !== mode) {
      setMode(customMode);
    }
    setScreen('cook-or-order');
    window.history.pushState({ screen: 'cook-or-order' }, '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [mode, setMode]);

  const handleBackToSuggestion = useCallback(() => {
    setScreen('suggestion');
    if (window.history.state?.screen === 'cook-or-order') window.history.back();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleBack = useCallback(() => {
    if (savedPrefs) {
      setDietType(savedPrefs.dietType);
      setMode(savedPrefs.mode);
      setMealTime(savedPrefs.mealTime);
      setSavedPrefs(null);
    }
    resetShownDishes();
    setScreen('preferences');
    if (window.history.state?.screen === 'suggestion') window.history.back();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [savedPrefs, setDietType, setMode, setMealTime]);

  return {
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
  };
}
