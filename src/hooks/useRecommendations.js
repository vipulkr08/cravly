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
    if (params.get('screen') === 'mood') return 'mood';
    if (window.location.hash === '#mood') return 'mood';
  }
  return 'welcome';
};

export function useRecommendations({ dietType, setDietType, mode, setMode, mealTime, setMealTime }) {
  const [screen, setScreen] = useState(getInitialScreen); // 'welcome' | 'mood' | 'input' | 'suggestion'
  const [selectedMood, setSelectedMood] = useState('cosy');
  const [city, setCity] = useState('Bengaluru');
  const [currentDishes, setCurrentDishes] = useState([]);
  const [savedPrefs, setSavedPrefs] = useState(null); // for Surprise Me restore

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
    const activeMode = customMode || mode;
    if (customMode && customMode !== mode) {
      setMode(customMode);
    }
    const dishes = getRecommendationsForMood(mood, dietType, activeMode, mealTime, 3);
    pushToSuggestion(dishes);
  }, [dietType, mode, mealTime, setMode, pushToSuggestion]);

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
    const dishes = getRecommendationsForMood(selectedMood, dietType, mode, mealTime, 3);
    setCurrentDishes(dishes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedMood, dietType, mode, mealTime]);

  const handleSelect = useCallback((index) => {
    if (index === 0) return;
    setCurrentDishes(prev => [...prev.slice(index), ...prev.slice(0, index)]);
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
    setScreen('mood');
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
    handleGetStarted,
    handleBackToWelcome,
    handleMoodPicks,
    handleFeedMe,
    handleSurpriseMe,
    handleShuffle,
    handleSelect,
    handleBack,
  };
}
