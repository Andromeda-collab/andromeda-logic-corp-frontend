import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Runs an async API call on mount (and whenever `deps` change) and exposes
 * loading / error / data state for the UI.
 *
 * @param {() => Promise<{data: any}>} fetcher  usually a service fn, e.g. () => getSpecialties()
 * @param {Array}  deps          re-run when these change (default: run once)
 * @param {object} options
 * @param {any}    options.fallback  value for `data` before the call resolves / on error
 * @returns {{data:any, loading:boolean, error:string|null, reload:() => void}}
 */
export default function useApiResource(fetcher, deps = [], options = {}) {
  const { fallback = null } = options;
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const mountedRef = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const run = useCallback(() => {
    setLoading(true);
    setError(null);
    return fetcherRef
      .current()
      .then((res) => {
        if (mountedRef.current) setData(res.data);
      })
      .catch((err) => {
        if (mountedRef.current) {
          setError(err?.uiMessage || err?.message || "Request failed.");
        }
      })
      .finally(() => {
        if (mountedRef.current) setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { data, loading, error, reload: run };
}
