// Time formatting utilities
export const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'только что';
  if (mins < 60) return `${mins} мин назад`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} ч назад`;
  const days = Math.floor(hrs / 24);
  return `${days} дн назад`;
};

// Navigation utilities
const normalizeRouteValue = (value = '') => String(value).replace(/^#/, '').replace(/^\/+|\/+$/g, '');

const parseRouteValue = (routeValue, SUBSECTION_TITLES = {}) => {
  const normalized = normalizeRouteValue(routeValue);
  const [section = 'home', second = null, third = null] = normalized ? normalized.split('/') : ['home'];

  if (!second) {
    return { section: section || 'home', subsection: null, diseaseId: null };
  }

  const knownSubsection = Boolean(SUBSECTION_TITLES[section]?.[second]);

  if (knownSubsection) {
    return {
      section,
      subsection: second,
      diseaseId: third || null,
    };
  }

  return {
    section,
    subsection: null,
    diseaseId: second,
  };
};

export const parseHash = (hashValue, SUBSECTION_TITLES = {}) => (
  parseRouteValue(hashValue, SUBSECTION_TITLES)
);

export const parseLocation = (pathname = '/', hashValue = '', SUBSECTION_TITLES = {}) => {
  const normalizedPath = normalizeRouteValue(pathname);

  if (normalizedPath) {
    return parseRouteValue(normalizedPath, SUBSECTION_TITLES);
  }

  if (hashValue) {
    return parseRouteValue(hashValue, SUBSECTION_TITLES);
  }

  return { section: 'home', subsection: null, diseaseId: null };
};

export const buildPath = (section, subsection, diseaseId) => {
  if (!section || section === 'home') {
    return '/';
  }

  const parts = [section];

  if (subsection) {
    parts.push(subsection);
  }

  if (diseaseId) {
    parts.push(diseaseId);
  }

  return `/${parts.join('/')}`;
};

export const buildHash = (section, subsection, diseaseId) => {
  const path = buildPath(section, subsection, diseaseId);
  return path === '/' ? '' : `#${path.slice(1)}`;
};

// Debounce utility
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle utility
export const throttle = (func, limit) => {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

// Generate unique ID
export const generateId = (prefix = 'id') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Format date to locale string
export const formatDate = (date, locale = 'ru-RU') => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Sanitize HTML to prevent XSS
export const sanitizeHTML = (html) => {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
};

// Clamp number between min and max
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

// Array chunk utility
export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const groupKey = typeof key === 'function' ? key(item) : item[key];
    (result[groupKey] = result[groupKey] || []).push(item);
    return result;
  }, {});
};

// Sort array by multiple keys
export const sortBy = (array, keys) => {
  return [...array].sort((a, b) => {
    for (const key of keys) {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
    }
    return 0;
  });
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Truncate text
export const truncate = (str, length, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
};
