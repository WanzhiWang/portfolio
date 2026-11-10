import { useEffect, useState } from 'react';

/**
 * Fetches JSON data and manages loading and error states.
 * Cancels the request when the URL changes or the component unmounts.
 *
 * @param {string} url - JSON resource URL.
 * @returns {{
 *   data: *,
 *   loading: boolean,
 *   error: Error|null
 * }} Request data, loading state and error.
 */
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setData(null);
    setLoading(true);
    setError(null);

    async function loadData() {
      try {
        const response = await fetch(url, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        const result = await response.json();

        if (active) {
          setData(result);
        }
      } catch (err) {
        if (active && !controller.signal.aborted) {
          setError(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      active = false;
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}
