'use client';

import { useEffect, useState } from 'react';

/**
 * State persisted to sessionStorage as JSON, hydrated on mount. Shared by the
 * checkout flow's address forms, billing-differs flag, and shipping method
 * choice — all session-scoped, unlike the cart which persists longer.
 */
export function useSessionState<T>(
  key: string,
  initial: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initial);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(key);
      if (raw !== null) {
        setValue(JSON.parse(raw));
      }
    } catch {
      // ignore corrupted/unavailable storage, keep initial
    }
    setHasHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // storage unavailable (e.g. private browsing) — stays in-memory only
    }
  }, [key, value, hasHydrated]);

  return [value, setValue, hasHydrated];
}
