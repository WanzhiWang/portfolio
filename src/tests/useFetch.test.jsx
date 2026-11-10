import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from 'vitest';
import {
  renderHook,
  waitFor,
  act,
  cleanup,
} from '@testing-library/react';
import useFetch from '../hooks/useFetch';

describe('useFetch', () => {
  let fetchMock;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('starts in the loading state and returns JSON on success', async () => {
    const responseData = { about: 'My biography' };

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => responseData,
    });

    const { result } = renderHook(() => useFetch('/profile/about.json'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(responseData);
    expect(result.current.error).toBeNull();
  });

  it('reports an unsuccessful HTTP response', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useFetch('/missing.json'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error.message).toBe('Request failed: 404');
  });

  it('reports a network failure', async () => {
    fetchMock.mockRejectedValue(new Error('Network unavailable'));

    const { result } = renderHook(() => useFetch('/profile/about.json'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error.message).toBe('Network unavailable');
  });

  it('reports invalid JSON', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => {
        throw new SyntaxError('Invalid JSON');
      },
    });

    const { result } = renderHook(() => useFetch('/invalid.json'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeInstanceOf(SyntaxError);
  });

  it('aborts the request when the component unmounts', () => {
    fetchMock.mockReturnValue(new Promise(() => {}));

    const { unmount } = renderHook(() => useFetch('/profile/about.json'));
    const { signal } = fetchMock.mock.calls[0][1];

    expect(signal.aborted).toBe(false);

    unmount();

    expect(signal.aborted).toBe(true);
  });

  it('clears an earlier error when a new request succeeds', async () => {
    fetchMock.mockRejectedValueOnce(new Error('First request failed'));

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/first.json' } },
    );

    await waitFor(() => {
      expect(result.current.error).not.toBeNull();
    });

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'Recovered' }),
    });

    rerender({ url: '/second.json' });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBeNull();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({ title: 'Recovered' });
    expect(result.current.error).toBeNull();
  });

  it('ignores an old response after the URL changes', async () => {
    let resolveFirst;

    const firstRequest = new Promise((resolve) => {
      resolveFirst = resolve;
    });

    fetchMock.mockReturnValueOnce(firstRequest);

    const { result, rerender } = renderHook(
      ({ url }) => useFetch(url),
      { initialProps: { url: '/first.json' } },
    );

    const firstSignal = fetchMock.mock.calls[0][1].signal;

    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ title: 'New data' }),
    });

    rerender({ url: '/second.json' });

    expect(firstSignal.aborted).toBe(true);

    await waitFor(() => {
      expect(result.current.data).toEqual({ title: 'New data' });
    });

    // Simulate a response arriving despite cancellation.
    await act(async () => {
      resolveFirst({
        ok: true,
        json: async () => ({ title: 'Old data' }),
      });

      await firstRequest;
    });

    expect(result.current.data).toEqual({ title: 'New data' });
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
