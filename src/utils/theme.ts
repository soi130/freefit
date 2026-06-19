export type ThemePref = 'light' | 'dark' | 'system';
export type SchemePref = 'olive' | 'ocean';

const KEY = 'lift-theme';
const SCHEME_KEY = 'lift-scheme';
const META_DARK = '#181813';
// Light status-bar/chrome color per scheme (primary-600).
const META_LIGHT: Record<SchemePref, string> = { olive: '#6b7d3a', ocean: '#137a6a' };

export function getThemePref(): ThemePref {
  const v = localStorage.getItem(KEY);
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system';
}

export function getSchemePref(): SchemePref {
  return localStorage.getItem(SCHEME_KEY) === 'ocean' ? 'ocean' : 'olive';
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
  if (meta) {
    meta.setAttribute('content', resolved === 'dark' ? META_DARK : META_LIGHT[getSchemePref()]);
  }
}

function applyScheme(scheme: SchemePref): void {
  if (scheme === 'olive') document.documentElement.removeAttribute('data-scheme');
  else document.documentElement.setAttribute('data-scheme', scheme);
}

export function applyTheme(pref: ThemePref): void {
  applyResolved(resolveTheme(pref));
}

export function setThemePref(pref: ThemePref): void {
  localStorage.setItem(KEY, pref);
  applyTheme(pref);
  window.dispatchEvent(new Event('themechange'));
}

export function setSchemePref(scheme: SchemePref): void {
  localStorage.setItem(SCHEME_KEY, scheme);
  applyScheme(scheme);
  applyResolved(resolveTheme(getThemePref())); // refresh the chrome color
  window.dispatchEvent(new Event('themechange'));
}

let initialized = false;
// Apply the stored theme + scheme and keep 'system' in sync with OS changes.
// Safe to call before React mounts (main.tsx) to avoid a flash of wrong theme.
export function initTheme(): void {
  applyScheme(getSchemePref());
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
