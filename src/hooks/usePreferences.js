/**
 * usePreferences — dietType + mode, persisted to localStorage
 */
import { useState, useEffect } from 'react';

export function usePreferences() {
  const [dietType, setDietType] = useState(
    () => localStorage.getItem('cravly-diet') || 'veg'
  );
  const [mode, setMode] = useState(
    () => localStorage.getItem('cravly-mode') || 'order'
  );

  useEffect(() => {
    localStorage.setItem('cravly-diet', dietType);
    localStorage.setItem('cravly-mode', mode);
  }, [dietType, mode]);

  return { dietType, setDietType, mode, setMode };
}
