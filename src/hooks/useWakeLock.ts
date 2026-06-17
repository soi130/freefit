import { useEffect, useRef } from 'react';

// Holds a screen wake lock while `enabled`. The browser drops the lock when the
// tab is hidden, so we re-acquire it whenever the page becomes visible again.
export function useWakeLock(enabled: boolean): void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!enabled || !('wakeLock' in navigator)) return;
    let cancelled = false;

    async function acquire() {
      if (sentinelRef.current || document.visibilityState !== 'visible') return;
      try {
        const sentinel = await navigator.wakeLock.request('screen');
        if (cancelled) {
          await sentinel.release().catch(() => {});
          return;
        }
        sentinel.addEventListener('release', () => {
          sentinelRef.current = null;
        });
        sentinelRef.current = sentinel;
      } catch {
        // Denied (e.g. low battery) or unsupported — silently skip.
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === 'visible') void acquire();
    }

    void acquire();
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', onVisibilityChange);
      const sentinel = sentinelRef.current;
      sentinelRef.current = null;
      sentinel?.release().catch(() => {});
    };
  }, [enabled]);
}
