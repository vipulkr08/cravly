/**
 * useMealTime — auto-detects current meal time, refreshes every minute,
 *               supports a manual override.
 */
import { useState, useEffect } from 'react';
import { getMealTime } from '../utils/timeUtils';

export function useMealTime() {
  const [autoMealTime, setAutoMealTime] = useState(getMealTime);
  const [manualOverride, setManualOverride] = useState(null);

  // Refresh auto-time every minute
  useEffect(() => {
    const id = setInterval(() => setAutoMealTime(getMealTime()), 60_000);
    return () => clearInterval(id);
  }, []);

  return {
    mealTime: manualOverride ?? autoMealTime,
    setMealTime: setManualOverride, // null clears the override
  };
}
