import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`useLocalStorage: error reading key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      setStoredValue((currentValue) => {
        const valueToStore = value instanceof Function ? value(currentValue) : value;
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        return valueToStore;
      });
    } catch (error) {
      console.warn(`useLocalStorage: error setting key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage('favorites', {});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return [favorites, setFavorites, toggleFavorite];
}

export function useViewHistory() {
  const [history, setHistory] = useLocalStorage('viewHistory', []);

  const addToHistory = (item) => {
    setHistory((prev) => {
      const existingItem = prev.find((h) => h.id === item.id);
      const filtered = prev.filter((h) => h.id !== item.id);
      const source = item.source || existingItem?.lastSource || 'direct_navigation';
      const previousSourceCounts = existingItem?.sourceCounts || {};
      const newItem = {
        ...existingItem,
        ...item,
        time: new Date().toISOString(),
        lastSource: source,
        openCount: (existingItem?.openCount || 0) + 1,
        sourceCounts: {
          ...previousSourceCounts,
          [source]: (previousSourceCounts[source] || 0) + 1,
        },
      };
      return [newItem, ...filtered].slice(0, 15);
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return [history, addToHistory, clearHistory];
}

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useLocalStorage('searchHistory', []);

  const addSearchQuery = (query) => {
    if (!query || query.trim().length < 2) return;
    setSearchHistory((prev) => {
      const filtered = prev.filter((q) => q !== query.trim());
      return [query.trim(), ...filtered].slice(0, 5);
    });
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
  };

  return [searchHistory, addSearchQuery, clearSearchHistory];
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', true);

  useEffect(() => {
    document.body.classList.toggle('light-mode', !darkMode);
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    document.documentElement.style.colorScheme = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return [darkMode, toggleDarkMode];
}

export function useGameProgress() {
  const [progress, setProgress] = useLocalStorage('gameProgress', {
    diagnosisDuel: { bestScore: 0, completions: 0 },
    stoneCrusher: { bestScore: 0, completions: 0 },
    prostateDefender: { bestScore: 0, completions: 0 },
    uroEndoSim: { bestScore: 0, completions: 0 },
  });

  const recordScore = (gameId, score, completed = false) => {
    setProgress((prev) => {
      const current = prev[gameId] || { bestScore: 0, completions: 0 };
      return {
        ...prev,
        [gameId]: {
          bestScore: Math.max(current.bestScore, score),
          completions: current.completions + (completed ? 1 : 0),
        },
      };
    });
  };

  return [progress, recordScore];
}
