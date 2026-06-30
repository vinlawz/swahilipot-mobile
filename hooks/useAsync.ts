import { useEffect, useRef, useState, useCallback } from 'react';

interface UseAsyncOptions {
  cache?: boolean;
  retryCount?: number;
  retryDelay?: number;
  onError?: (error: Error) => void;
  onSuccess?: (data: any) => void;
}

interface UseAsyncState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

const asyncCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export function useAsync<T>(
  fn: () => Promise<T>,
  deps: any[] = [],
  options: UseAsyncOptions = {}
): UseAsyncState<T> & { retry: () => void } {
  const {
    cache = true,
    retryCount = 3,
    retryDelay = 1000,
    onError,
    onSuccess,
  } = options;

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  const retryCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const fnKeyRef = useRef(fn.toString());

  const execute = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      // Check cache first
      if (cache) {
        const cached = asyncCache.get(fnKeyRef.current);
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
          setState({
            data: cached.data,
            loading: false,
            error: null,
          });
          onSuccess?.(cached.data);
          return;
        }
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      const result = await fn();

      if (!isMountedRef.current) return;

      // Cache the result
      if (cache) {
        asyncCache.set(fnKeyRef.current, {
          data: result,
          timestamp: Date.now(),
        });
      }

      setState({
        data: result,
        loading: false,
        error: null,
      });

      onSuccess?.(result);
      retryCountRef.current = 0;
    } catch (err) {
      if (!isMountedRef.current) return;

      const error = err instanceof Error ? err : new Error(String(err));

      if (retryCountRef.current < retryCount) {
        retryCountRef.current++;
        setTimeout(() => {
          execute();
        }, retryDelay * retryCountRef.current);
        return;
      }

      setState({
        data: null,
        loading: false,
        error,
      });

      onError?.(error);
    }
  }, [fn, cache, retryCount, retryDelay, onError, onSuccess]);

  useEffect(() => {
    isMountedRef.current = true;
    retryCountRef.current = 0;
    execute();

    return () => {
      isMountedRef.current = false;
    };
  }, deps);

  return {
    ...state,
    retry: () => {
      retryCountRef.current = 0;
      execute();
    },
  };
}
