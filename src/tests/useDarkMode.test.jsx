import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import useDarkMode from '../hooks/useDarkMode';

describe('useDarkMode', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it('defaults to light mode when no preference is saved', () => {
    const { result } = renderHook(() => useDarkMode());

    expect(result.current.value).toBe(false);
    expect(window.localStorage.getItem('darkMode')).toBe('false');
  });

  it('uses the supplied initial value when no preference is saved', () => {
    const { result } = renderHook(() => useDarkMode(true));

    expect(result.current.value).toBe(true);
    expect(window.localStorage.getItem('darkMode')).toBe('true');
  });

  it('restores a saved dark preference over the initial value', () => {
    window.localStorage.setItem('darkMode', 'true');

    const { result } = renderHook(() => useDarkMode(false));

    expect(result.current.value).toBe(true);
  });

  it('restores a saved light preference over the initial value', () => {
    window.localStorage.setItem('darkMode', 'false');

    const { result } = renderHook(() => useDarkMode(true));

    expect(result.current.value).toBe(false);
  });

  it('toggles the theme and persists each change', () => {
    const { result } = renderHook(() => useDarkMode(false));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
    expect(window.localStorage.getItem('darkMode')).toBe('true');

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(false);
    expect(window.localStorage.getItem('darkMode')).toBe('false');
  });

  it('enables and disables dark mode', () => {
    const { result } = renderHook(() => useDarkMode(false));

    act(() => {
      result.current.enable();
    });

    expect(result.current.value).toBe(true);
    expect(window.localStorage.getItem('darkMode')).toBe('true');

    act(() => {
      result.current.disable();
    });

    expect(result.current.value).toBe(false);
    expect(window.localStorage.getItem('darkMode')).toBe('false');
  });

  it('preserves the selected theme after remounting', () => {
    const firstMount = renderHook(() => useDarkMode(false));

    act(() => {
      firstMount.result.current.toggle();
    });

    firstMount.unmount();

    const secondMount = renderHook(() => useDarkMode(false));

    expect(secondMount.result.current.value).toBe(true);
  });

  it('uses the initial value when reading storage fails', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    const { result } = renderHook(() => useDarkMode(true));

    expect(result.current.value).toBe(true);
  });

  it('continues switching themes when writing storage fails', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage unavailable');
    });

    const { result } = renderHook(() => useDarkMode(false));

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });
});
