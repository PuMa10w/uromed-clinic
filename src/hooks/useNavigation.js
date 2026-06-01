import { useState, useEffect, useCallback } from 'react';
import { parseLocation, buildPath } from '../utils';

export const useHashNavigation = (SUBSECTION_TITLES = {}) => {
  const [navigation, setNavigation] = useState(() => {
    return parseLocation(window.location.pathname, window.location.hash, SUBSECTION_TITLES);
  });

  const [history, setHistory] = useState([]);

  const navigate = useCallback((section, subsection = null, diseaseId = null, options = {}) => {
    const newPath = buildPath(section, subsection, diseaseId);
    const newNav = { section, subsection, diseaseId };

    if (options.replaceState) {
      window.history.replaceState(null, '', newPath);
    } else {
      window.history.pushState(null, '', newPath);
    }

    setNavigation(newNav);

    if (!options.skipHistory) {
      setHistory(prev => [...prev.slice(-19), { ...newNav, timestamp: Date.now() }]);
    }

    return newPath;
  }, []);

  const goBack = useCallback(() => {
    if (history.length > 1) {
      const prevState = history[history.length - 2];
      setNavigation(prevState);
      const path = buildPath(prevState.section, prevState.subsection, prevState.diseaseId);
      window.history.replaceState(null, '', path);
      return true;
    }
    return false;
  }, [history]);

  const canGoBack = history.length > 1;

  useEffect(() => {
    const syncNavigation = () => {
      setNavigation(parseLocation(window.location.pathname, window.location.hash, SUBSECTION_TITLES));
    };

    window.addEventListener('hashchange', syncNavigation);
    window.addEventListener('popstate', syncNavigation);
    return () => {
      window.removeEventListener('hashchange', syncNavigation);
      window.removeEventListener('popstate', syncNavigation);
    };
  }, [SUBSECTION_TITLES]);

  return {
    ...navigation,
    navigate,
    goBack,
    canGoBack,
    history: history.slice(-20),
  };
};

export const useUrlParams = () => {
  const [params, setParams] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const obj = {};
    for (const [key, value] of searchParams) {
      obj[key] = value;
    }
    return obj;
  });

  const updateParam = useCallback((key, value) => {
    const url = new URL(window.location.href);
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
    window.history.pushState(null, '', url);
    setParams(Object.fromEntries(url.searchParams));
  }, []);

  const removeParam = useCallback((key) => {
    updateParam(key, null);
  }, [updateParam]);

  return { params, updateParam, removeParam };
};

export const useQueryParams = (defaultValues = {}) => {
  const [values, setValues] = useState(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const merged = { ...defaultValues };
    for (const [key, value] of searchParams) {
      if (key in merged) {
        merged[key] = value;
      }
    }
    return merged;
  });

  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const newValues = { ...defaultValues };
      for (const [key, value] of searchParams) {
        if (key in newValues) {
          newValues[key] = value;
        }
      }
      setValues(newValues);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [defaultValues]);

  const setValue = useCallback((key, value) => {
    setValues(prev => {
      const newValues = { ...prev, [key]: value };
      const url = new URL(window.location.href);
      Object.entries(newValues).forEach(([k, v]) => {
        if (v === defaultValues[k]) {
          url.searchParams.delete(k);
        } else {
          url.searchParams.set(k, v);
        }
      });
      window.history.pushState(null, '', url);
      return newValues;
    });
  }, [defaultValues]);

  const reset = useCallback(() => {
    const url = new URL(window.location.href);
    url.search = '';
    window.history.pushState(null, '', url);
    setValues(defaultValues);
  }, [defaultValues]);

  return { values, setValue, reset };
};

export default {
  useHashNavigation,
  useUrlParams,
  useQueryParams,
};
