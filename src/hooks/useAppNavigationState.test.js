import { act, renderHook } from '@testing-library/react';
import useAppNavigationState from './useAppNavigationState';

jest.mock('../data', () => ({
  allDiseases: [
    { id: 'urolithiasis', name: 'МКБ', section: 'urology', subsection: 'stones' },
  ],
  diseaseById: {
    urolithiasis: { id: 'urolithiasis', name: 'МКБ', section: 'urology', subsection: 'stones' },
  },
}));

describe('useAppNavigationState', () => {
  beforeEach(() => {
    window.history.replaceState(null, '', '/urology/stones/urolithiasis');
    window.scrollTo = jest.fn();
  });

  it('reads initial state from pathname', () => {
    const addToHistory = jest.fn();
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    expect(result.current.activeSection).toBe('urology');
    expect(result.current.activeSubsection).toBe('stones');
    expect(result.current.selectedDiseaseId).toBe('urolithiasis');
  });

  it('keeps support for legacy hash deep links', () => {
    window.history.replaceState(null, '', '/');
    window.location.hash = '#urology/stones/urolithiasis';

    const addToHistory = jest.fn();
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    expect(result.current.activeSection).toBe('urology');
    expect(result.current.activeSubsection).toBe('stones');
    expect(result.current.selectedDiseaseId).toBe('urolithiasis');
  });

  it('updates state through handleNavigate', () => {
    const addToHistory = jest.fn();
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    act(() => {
      result.current.handleNavigate('home', null, null, { skipHistory: true });
    });

    expect(result.current.activeSection).toBe('home');
    expect(result.current.activeSubsection).toBe(null);
    expect(result.current.selectedDiseaseId).toBe(null);
  });

  it('stores navigation source for disease opens', () => {
    const addToHistory = jest.fn();
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    act(() => {
      result.current.handleNavigate('andrology', 'fertility', 'male-infertility', {
        skipHistory: true,
        source: 'landing_symptom_entry',
      });
    });

    expect(result.current.selectedDiseaseId).toBe('male-infertility');
    expect(result.current.navigationSource).toBe('landing_symptom_entry');
  });

  it('persists navigation source into view history entries', async () => {
    const addToHistory = jest.fn();
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    await act(async () => {
      result.current.handleNavigate('urology', 'stones', 'urolithiasis', {
        source: 'search',
      });
      await Promise.resolve();
    });

    expect(addToHistory).toHaveBeenCalledWith(expect.objectContaining({
      id: 'urolithiasis',
      source: 'search',
    }));
  });

  it('keeps repeated opens visible for downstream history retention metrics', async () => {
    const historyState = [];
    const addToHistory = jest.fn((item) => {
      const existingIndex = historyState.findIndex((entry) => entry.id === item.id);
      const existing = existingIndex >= 0 ? historyState[existingIndex] : null;
      const source = item.source || existing?.lastSource || 'direct_navigation';
      const next = {
        ...existing,
        ...item,
        lastSource: source,
        openCount: (existing?.openCount || 0) + 1,
        sourceCounts: {
          ...(existing?.sourceCounts || {}),
          [source]: ((existing?.sourceCounts || {})[source] || 0) + 1,
        },
      };
      if (existingIndex >= 0) {
        historyState.splice(existingIndex, 1);
      }
      historyState.unshift(next);
    });
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    await act(async () => {
      result.current.handleNavigate('urology', 'stones', 'urolithiasis', { source: 'search' });
      await Promise.resolve();
    });

    await act(async () => {
      result.current.handleNavigate('urology', 'stones', 'urolithiasis', { source: 'history_reopen' });
      await Promise.resolve();
    });

    expect(historyState[0]).toEqual(expect.objectContaining({
      id: 'urolithiasis',
      openCount: 2,
      lastSource: 'history_reopen',
      sourceCounts: expect.objectContaining({
        search: 1,
        history_reopen: 1,
      }),
    }));
  });

  it('returns to article origin when closing disease', () => {
    const addToHistory = jest.fn();
    const setFavorites = jest.fn();

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    act(() => {
      result.current.handleNavigate('home', null, null, { skipHistory: true });
    });

    act(() => {
      result.current.handleNavigate('urology', 'stones', 'urolithiasis', {
        skipHistory: true,
        origin: { section: 'home', subsection: null },
      });
    });

    expect(result.current.selectedDiseaseId).toBe('urolithiasis');

    act(() => {
      result.current.closeDisease({ preserveScroll: true });
    });

    expect(result.current.activeSection).toBe('home');
    expect(result.current.activeSubsection).toBe(null);
    expect(result.current.selectedDiseaseId).toBe(null);
  });

  it('removes favorite through special route action', () => {
    const addToHistory = jest.fn();
    const setFavorites = jest.fn((updater) => updater({ urolithiasis: true }));

    const { result } = renderHook(() => useAppNavigationState({ addToHistory, setFavorites }));

    act(() => {
      result.current.handleNavigate('remove-fav', 'urolithiasis');
    });

    expect(setFavorites).toHaveBeenCalled();
  });
});
