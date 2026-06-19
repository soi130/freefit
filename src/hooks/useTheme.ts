import { useEffect, useState, useSyncExternalStore } from 'react';
import { getSchemePref, getThemePref, resolveTheme } from '../utils/theme';
import type { SchemePref, ThemePref } from '../utils/theme';

function subscribe(cb: () => void): () => void {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', cb);
  window.addEventListener('themechange', cb);
  return () => {
    mq.removeEventListener('change', cb);
    window.removeEventListener('themechange', cb);
  };
}

export function useThemePref(): ThemePref {
  return useSyncExternalStore(subscribe, getThemePref, () => 'system');
}

export function useSchemePref(): SchemePref {
  return useSyncExternalStore(subscribe, getSchemePref, () => 'olive');
}

export function useResolvedTheme(): 'light' | 'dark' {
  return useSyncExternalStore(
    subscribe,
    () => resolveTheme(getThemePref()),
    () => 'light',
  );
}

// Re-renders on any theme or scheme change. Use when reading live CSS variables
// (e.g. charts) so values refresh even when the resolved light/dark is unchanged.
export function useThemeTick(): number {
  const [tick, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick((t) => t + 1)), []);
  return tick;
}
