export type ThemePref = 'light' | 'dark' | 'system';

const KEY = 'lift-theme';
// Matches the cream background of each theme, for the browser/status-bar chrome.
const META_LIGHT = '#6b7d3a';
const META_DARK = '#181813';

export function getThemePref(): ThemePref {
  const v = localStorage.getItem(KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

export function resolveTheme(pref: ThemePref): 'light' | 'dark' {
  if (pref === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return pref;
}

function applyResolved(resolved: 'light' | 'dark'): void {
  document.documentElement.classList.toggle('dark', resolved === 'dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', resolved === 'dark' ? META_DARK : META_LIGHT);
}

export function applyTheme(pref: ThemePref): void {
  applyResolved(resolveTheme(pref));
}

export function setThemePref(pref: ThemePref): void {
  localStorage.setItem(KEY, pref);
  applyTheme(pref);
  window.dispatchEvent(new Event('themechange'));
}

let initialized = false;
// Apply the stored theme and keep 'system' in sync with OS changes. Safe to
// call before React mounts (runs in main.tsx) to avoid a flash of the wrong theme.
export function initTheme(): void {
  applyTheme(getThemePref());
  if (initialized) return;
  initialized = true;
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getThemePref() === 'system') {
      applyTheme('system');
      window.dispatchEvent(new Event('themechange'));
    }
  });
}
