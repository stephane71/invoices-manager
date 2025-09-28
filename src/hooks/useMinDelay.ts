import { useCallback, useRef, useState } from "react";

/**
 * useMinDelay enforces a minimum visible loading duration.
 *
 * Example:
 * const { pending, wrap } = useMinDelay(2000);
 * await wrap(() => doAsyncWork()); // pending becomes true immediately, stays for >= 2s
 */
export function useMinDelay(minMs: number = 2000) {
  const [pending, setPending] = useState(false);
  const startRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const start = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    startRef.current = Date.now();
    setPending(true);
  }, []);

  const stop = useCallback(() => {
    const startAt = startRef.current ?? Date.now();
    const elapsed = Date.now() - startAt;
    const remaining = Math.max(0, minMs - elapsed);
    const finalize = () => {
      setPending(false);
      timerRef.current = null;
      startRef.current = null;
    };
    if (remaining > 0) {
      timerRef.current = window.setTimeout(finalize, remaining);
    } else {
      finalize();
    }
  }, [minMs]);

  const wrap = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T> => {
      start();
      try {
        return await fn();
      } finally {
        stop();
      }
    },
    [start, stop],
  );

  return { pending, start, stop, wrap } as const;
}
