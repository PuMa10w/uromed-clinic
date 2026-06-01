import { useState, useCallback, useMemo, useEffect } from 'react';
import { debounce } from '../utils';

export const useSearch = (items, searchFields = ['name', 'icd', 'id'], options = {}) => {
  const {
    debounceMs = 300,
    minLength = 2,
    caseSensitive = false,
    limit = 50,
    sortByRelevance = true,
  } = options;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchItems = useCallback((searchQuery) => {
    if (!searchQuery || searchQuery.length < minLength) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const normalizedQuery = caseSensitive ? searchQuery : searchQuery.toLowerCase();
    const queryWords = normalizedQuery.split(/\s+/);

    const scored = items.map(item => {
      let score = 0;
      const fieldValues = searchFields.map(field => {
        const value = item[field];
        return caseSensitive ? value : value?.toLowerCase();
      });

      for (const fieldValue of fieldValues) {
        if (!fieldValue) continue;

        if (fieldValue === normalizedQuery) {
          score += 100;
        } else if (fieldValue.startsWith(normalizedQuery)) {
          score += 50;
        } else if (fieldValue.includes(normalizedQuery)) {
          score += 20;
        }

        for (const word of queryWords) {
          if (fieldValue.includes(word)) {
            score += 5;
          }
        }
      }

      return { item, score };
    });

    const filtered = scored
      .filter(({ score }) => score > 0)
      .sort((a, b) => sortByRelevance ? b.score - a.score : 0)
      .slice(0, limit)
      .map(({ item }) => item);

    setResults(filtered);
    setIsSearching(false);
  }, [items, searchFields, minLength, caseSensitive, limit, sortByRelevance]);

  const debouncedSearch = useMemo(
    () => debounce(searchItems, debounceMs),
    [searchItems, debounceMs]
  );

  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setIsSearching(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    clearSearch,
    hasResults: results.length > 0,
    resultCount: results.length,
  };
};

export const useFilter = (items, initialFilters = {}) => {
  const [filters, setFilters] = useState(initialFilters);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      return Object.entries(filters).every(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          return true;
        }

        const itemValue = item[key];

        if (Array.isArray(value)) {
          return value.includes(itemValue);
        }

        if (typeof value === 'function') {
          return value(itemValue, item);
        }

        if (typeof value === 'string') {
          return String(itemValue).toLowerCase().includes(value.toLowerCase());
        }

        return itemValue === value;
      });
    });
  }, [items, filters]);

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value !== null && value !== undefined && value !== ''
  );

  return {
    filters,
    filteredItems,
    setFilter,
    removeFilter,
    clearFilters,
    activeFilters: activeFilters.map(([key]) => key),
    filterCount: activeFilters.length,
  };
};

export default {
  useSearch,
  useFilter,
};