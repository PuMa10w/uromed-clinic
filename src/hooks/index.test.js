import { renderHook, act } from '@testing-library/react';
import {
  useDebounce,
  useToggle,
  useKeyPress,
} from './index';

describe('Custom Hooks', () => {
  describe('useDebounce', () => {
    it('returns initial value immediately', () => {
      const { result } = renderHook(() => useDebounce('initial', 500));
      expect(result.current).toBe('initial');
    });

    it('debounces value after delay', () => {
      jest.useFakeTimers();

      const { result, rerender } = renderHook(
        ({ value, delay }) => useDebounce(value, delay),
        { initialProps: { value: 'initial', delay: 100 } }
      );

      rerender({ value: 'updated', delay: 100 });
      expect(result.current).toBe('initial');

      act(() => {
        jest.advanceTimersByTime(100);
      });

      expect(result.current).toBe('updated');
      jest.useRealTimers();
    });
  });

  describe('useToggle', () => {
    it('initializes with default value', () => {
      const { result } = renderHook(() => useToggle(false));
      expect(result.current[0]).toBe(false);
    });

    it('toggles value', () => {
      const { result } = renderHook(() => useToggle(false));
      const [, toggle] = result.current;

      act(() => toggle());
      expect(result.current[0]).toBe(true);

      act(() => toggle());
      expect(result.current[0]).toBe(false);
    });

    it('sets true explicitly', () => {
      const { result } = renderHook(() => useToggle(false));
      const [, , setTrue] = result.current;

      act(() => setTrue());
      expect(result.current[0]).toBe(true);
    });

    it('sets false explicitly', () => {
      const { result } = renderHook(() => useToggle(true));
      const [, , , setFalse] = result.current;

      act(() => setFalse());
      expect(result.current[0]).toBe(false);
    });
  });

  describe('useKeyPress', () => {
    it('calls handler on key press', () => {
      const handler = jest.fn();
      renderHook(() => useKeyPress('k', handler));

      const event = new KeyboardEvent('keydown', { key: 'k' });
      window.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    it('does not call handler on different key', () => {
      const handler = jest.fn();
      renderHook(() => useKeyPress('k', handler));

      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      window.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });

    it('respects ctrl modifier', () => {
      const handler = jest.fn();
      renderHook(() => useKeyPress('k', handler, { ctrl: true }));

      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true });
      window.dispatchEvent(event);

      expect(handler).toHaveBeenCalled();
    });

    it('does not call when ctrl required but not pressed', () => {
      const handler = jest.fn();
      renderHook(() => useKeyPress('k', handler, { ctrl: true }));

      const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: false });
      window.dispatchEvent(event);

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
