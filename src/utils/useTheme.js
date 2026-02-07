import { useState, useEffect } from 'react';

/**
 * Custom hook for managing theme (light/dark mode)
 * Respects system preference and allows manual override
 */
export function useTheme() {
    // Initialize theme from localStorage or system preference
    const getInitialTheme = () => {
        // Check if user has a saved preference
        const savedTheme = localStorage.getItem('khaopi-theme');
        if (savedTheme) {
            return savedTheme;
        }

        // Check system preference
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }

        return 'light';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    // Apply theme to document
    useEffect(() => {
        const root = document.documentElement;
        root.setAttribute('data-theme', theme);

        // Update meta theme-color for mobile browsers
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#ffffff');
        }
    }, [theme]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        const handleChange = (e) => {
            // Only auto-switch if user hasn't set a manual preference
            if (!localStorage.getItem('khaopi-theme')) {
                setTheme(e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    // Toggle theme
    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('khaopi-theme', newTheme);
    };

    // Check if theme is dark
    const isDark = theme === 'dark';

    return { theme, toggleTheme, isDark };
}
