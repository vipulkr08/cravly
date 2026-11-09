/**
 * useRecommendations — owns currentDishes[], screen transitions,
 *                      and all recommendation actions.
 */
import { useState, useCallback } from 'react';
import {
  getMultipleRecommendations,
  resetShownDishes,
} from '../utils/recommendationEngine';

const MEAL_TIMES = ['breakfast', 'lunch', 'snacks', 'dinner', 'late-night'];
const DIETS      = ['veg', 'non-veg', 'egg'];
const MODES      = ['order', 'cook'];

export function useRecommendations({ dietType, setDietType, mode, setMode, mealTime, setMealTime }) {
  const [screen, setScreen] = useState('welcome'); // 'welcome' | 'input' | 'suggestion'
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
  const handleGetStarted = useCallback(() => setScreen('input'), []);

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
    const dishes = getMultipleRecommendations(dietType, mode, mealTime, 3);
    setCurrentDishes(dishes);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [dietType, mode, mealTime]);

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
    setScreen('input');
    if (window.history.state?.screen === 'suggestion') window.history.back();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [savedPrefs, setDietType, setMode, setMealTime]);

  return {
    screen,
    currentDishes,
    handleGetStarted,
    handleFeedMe,
    handleSurpriseMe,
    handleShuffle,
    handleSelect,
    handleBack,
  };
}
