/**
 * Time Utilities for KhaoPi
 * Determines meal time based on current local time
 */

/**
 * Get the current meal time category based on local time
 * @returns {'breakfast' | 'lunch' | 'snacks' | 'dinner' | 'late-night'}
 */
export function getMealTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeValue = hours * 60 + minutes; // Convert to minutes for easier comparison

    // Time ranges in minutes
    const ranges = {
        breakfast: { start: 7 * 60, end: 11 * 60 },        // 07:00 - 11:00
        lunch: { start: 12 * 60, end: 15 * 60 + 30 },      // 12:00 - 15:30
        snacks: { start: 16 * 60 + 30, end: 19 * 60 },     // 16:30 - 19:00
        dinner: { start: 19 * 60 + 30, end: 23 * 60 + 30 }, // 19:30 - 23:30
        'late-night': { start: 23 * 60 + 30, end: 5 * 60 }  // 23:30 - 05:00
    };

    // Late night wraps around midnight
    // If time is >= 23:30 OR time is < 05:00
    if (timeValue >= ranges['late-night'].start || timeValue < ranges['late-night'].end) {
        return 'late-night';
    }

    if (timeValue >= ranges.breakfast.start && timeValue < ranges.breakfast.end) {
        return 'breakfast';
    }

    if (timeValue >= ranges.lunch.start && timeValue < ranges.lunch.end) {
        return 'lunch';
    }

    if (timeValue >= ranges.snacks.start && timeValue < ranges.snacks.end) {
        return 'snacks';
    }

    if (timeValue >= ranges.dinner.start && timeValue < ranges.dinner.end) {
        return 'dinner';
    }

    // Default fallback for gaps (11:00-12:00, 15:30-16:30, 19:00-19:30)
    if (timeValue >= ranges.breakfast.end && timeValue < ranges.lunch.start) {
        return 'lunch'; // Late morning → suggest lunch
    }

    if (timeValue >= ranges.lunch.end && timeValue < ranges.snacks.start) {
        return 'snacks'; // Afternoon gap → suggest snacks
    }

    if (timeValue >= ranges.snacks.end && timeValue < ranges.dinner.start) {
        return 'dinner'; // Evening gap → suggest dinner
    }

    // Ultra-early morning (3:00 - 7:00) → suggest breakfast
    return 'breakfast';
}

/**
 * Get a friendly greeting based on meal time
 * @param {string} mealTime 
 * @returns {string}
 */
export function getMealGreeting(mealTime) {
    const greetings = {
        'breakfast': 'Good morning! ☀️',
        'lunch': 'Lunch time! 🍽️',
        'snacks': 'Snack break! 🍿',
        'dinner': 'Time for dinner! 🌙',
        'late-night': 'Midnight munchies? 🌃'
    };
    return greetings[mealTime] || 'Hungry? 🍛';
}

/**
 * Get meal time display name
 * @param {string} mealTime 
 * @returns {string}
 */
export function getMealTimeDisplay(mealTime) {
    const displays = {
        'breakfast': 'Breakfast',
        'lunch': 'Lunch',
        'snacks': 'Snacks',
        'dinner': 'Dinner',
        'late-night': 'Late Night'
    };
    return displays[mealTime] || mealTime;
}
