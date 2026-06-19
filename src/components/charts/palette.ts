import { useThemeTick } from '../../hooks/useTheme';

// Theme- and scheme-aware colors for the Recharts components, read live from the
// CSS variables so they follow both light/dark and the selected color scheme.
export interface ChartPalette {
  grid: string;
  tick: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  bar: string;
  line: string;
  emptyCell: string;
  cellBorder: string;
  ramp: [string, string, string];
}

export function useChartPalette(): ChartPalette {
  useThemeTick(); // re-render when theme or scheme changes
  const root = document.documentElement;
  const dark = root.classList.contains('dark');
  const cs = getComputedStyle(root);
  const rgb = (name: string) => `rgb(${cs.getPropertyValue(name).trim()})`;

  return {
    grid: dark ? rgb('--olive-800') : rgb('--olive-100'),
    tick: dark ? rgb('--olive-400') : rgb('--olive-700'),
    tooltipBg: rgb('--c-surface'),
    tooltipBorder: dark ? rgb('--olive-300') : rgb('--c-ink'),
    tooltipText: rgb('--c-ink'),
    bar: rgb('--olive-500'),
    line: rgb('--brick-500'),
    emptyCell: dark ? rgb('--c-subtle') : rgb('--olive-100'),
    cellBorder: dark ? 'rgba(255,255,255,0.12)' : 'rgba(51,50,28,0.12)',
    ramp: dark
      ? [rgb('--olive-600'), rgb('--olive-400'), rgb('--olive-300')]
      : [rgb('--olive-400'), rgb('--olive-600'), rgb('--olive-800')],
  };
}
