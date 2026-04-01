/**
 * Recommendation Engine for Cravly
 * Provides single dish recommendations based on diet, mode, and time
 */

import dishes from '../data/dishes.json';
import { getMealTime } from './timeUtils';

// Track shown dishes to avoid immediate repeats
let shownDishIds = new Set();

/**
 * Get a random item from an array
 * @param {Array} array 
 * @returns {*}
 */
function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get a single dish recommendation
 * @param {'veg' | 'non-veg' | 'egg'} dietType 
 * @param {'order' | 'cook'} mode 
 * @param {string} [mealTime] - Optional, auto-detected if not provided
 * @returns {object} Dish object
 */
export function getRecommendation(dietType, mode, mealTime = null) {
    const currentMealTime = mealTime || getMealTime();

    // Eggetarian logic: If diet is egg, include both egg and veg dishes
    let modeDishes = [];
    if (dietType === 'egg') {
        const vegDietDishes = dishes['veg'];
        const eggDietDishes = dishes['egg'];

        const vegMealDishes = vegDietDishes?.[currentMealTime]?.[mode] || [];
        const eggMealDishes = eggDietDishes?.[currentMealTime]?.[mode] || [];
        
        modeDishes = [...vegMealDishes, ...eggMealDishes];
    } else {
        const dietDishes = dishes[dietType];
        if (!dietDishes) {
            console.error(`Invalid diet type: ${dietType}`);
            return null;
        }

        const mealDishes = dietDishes[currentMealTime];
        if (!mealDishes) {
            console.error(`No dishes found for meal time: ${currentMealTime}`);
            return null;
        }

        modeDishes = mealDishes[mode] || [];
    }

    if (!modeDishes || modeDishes.length === 0) {
        console.error(`No dishes found for diet ${dietType}, time ${currentMealTime}, mode ${mode}`);
        return null;
    }

    // Filter out recently shown dishes if possible
    const availableDishes = modeDishes.filter(dish => !shownDishIds.has(dish.id));

    // If all dishes were shown, reset and use all
    const dishPool = availableDishes.length > 0 ? availableDishes : modeDishes;

    // Get random dish
    const selectedDish = getRandomItem(dishPool);

    // Track the shown dish
    shownDishIds.add(selectedDish.id);

    // Keep the set size manageable (last 10 dishes)
    if (shownDishIds.size > 10) {
        const idsArray = Array.from(shownDishIds);
        shownDishIds = new Set(idsArray.slice(-10));
    }

    return {
        ...selectedDish,
        mealTime: currentMealTime,
        dietType,
        mode
    };
}

/**
 * Get a new recommendation (shuffle), excluding the current dish
 * @param {'veg' | 'non-veg' | 'egg'} dietType 
 * @param {'order' | 'cook'} mode 
 * @param {string} currentDishId - ID of the current dish to exclude
 * @returns {object} New dish object
 */
export function shuffleRecommendation(dietType, mode, currentDishId) {
    // Add current dish to shown set
    if (currentDishId) {
        shownDishIds.add(currentDishId);
    }

    return getRecommendation(dietType, mode);
}

/**
 * Reset the shown dishes tracking
 */
export function resetShownDishes() {
    shownDishIds.clear();
}

/**
 * Get multiple unique recommendations with fallback strategy
 * @param {'veg' | 'non-veg' | 'egg'} dietType 
 * @param {'order' | 'cook'} mode 
 * @param {string} [mealTime] 
 * @param {number} count 
 * @returns {Array} Array of dish objects
 */
export function getMultipleRecommendations(dietType, mode, mealTime = null, count = 3) {
    const currentMealTime = mealTime || getMealTime();
    let candidates = [];

    // Helper to extract dishes from a specific path
    const getDishes = (dt, mt, md) => {
        try {
            const d = dishes[dt];
            if (!d) return [];
            const m = d[mt];
            if (!m) return [];
            return m[md] || [];
        } catch (e) {
            return [];
        }
    };

    // 1. Try Exact Match
    if (dietType === 'egg') {
        const vegPool = getDishes('veg', currentMealTime, mode);
        const eggPool = getDishes('egg', currentMealTime, mode);
        candidates = [...vegPool, ...eggPool];
    } else {
        candidates = getDishes(dietType, currentMealTime, mode);
    }

    // 2. If not enough, try right diet & time, but SWAP mode (order <-> cook)
    if (!candidates || candidates.length < count) {
        const otherMode = mode === 'order' ? 'cook' : 'order';
        let fallbackDishes = [];
        if (dietType === 'egg') {
            const vegFallback = getDishes('veg', currentMealTime, otherMode);
            const eggFallback = getDishes('egg', currentMealTime, otherMode);
            fallbackDishes = [...vegFallback, ...eggFallback];
        } else {
            fallbackDishes = getDishes(dietType, currentMealTime, otherMode);
        }
        candidates = [...(candidates || []), ...fallbackDishes];
    }

    // 3. If STILL not enough, get ANY dish from this diet (desperation mode)
    if (!candidates || candidates.length < count) {
        const anyDietDishes = [];
        const gatherAny = (dt) => {
            try {
                const dietObj = dishes[dt];
                if (dietObj) {
                    Object.values(dietObj).forEach(meal => {
                        Object.values(meal).forEach(list => {
                            if (Array.isArray(list)) anyDietDishes.push(...list);
                        });
                    });
                }
            } catch (e) { }
        };

        if (dietType === 'egg') {
            gatherAny('veg');
            gatherAny('egg');
        } else {
            gatherAny(dietType);
        }
        candidates = [...(candidates || []), ...anyDietDishes];
    }

    // Deduplicate by ID
    const uniqueMap = new Map();
    (candidates || []).forEach(item => {
        if (item && item.id) uniqueMap.set(item.id, item);
    });
    const uniqueCandidates = Array.from(uniqueMap.values());

    // Shuffle
    const shuffled = uniqueCandidates.sort(() => 0.5 - Math.random());

    // Return requested count, enriched with metadata
    return shuffled.slice(0, count).map(dish => ({
        ...dish,
        mealTime: currentMealTime,
        dietType,
        mode
    }));
}

/**
 * Generate Swiggy search URL
 * @param {string} searchTerm 
 * @returns {string}
 */
export function getSwiggyUrl(searchTerm) {
    const encoded = encodeURIComponent(searchTerm);
    return `https://www.swiggy.com/search?query=${encoded}`;
}

/**
 * Generate Zomato search URL
 * @param {string} searchTerm 
 * @returns {string}
 */
export function getZomatoUrl(searchTerm) {
    const encoded = encodeURIComponent(searchTerm);
    return `https://www.zomato.com/bangalore/restaurants?q=${encoded}`;
}

/**
 * Generate YouTube search URL for recipes
 * @param {string} searchTerm 
 * @returns {string}
 */
export function getYouTubeUrl(searchTerm) {
    const encoded = encodeURIComponent(searchTerm);
    return `https://www.youtube.com/results?search_query=${encoded}`;
}
