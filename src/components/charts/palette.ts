// Theme-aware colors for the Recharts components, which need concrete color
// strings rather than CSS variables.
export interface ChartPalette {
  grid: string;
  tick: string;
  tooltipBg: string;
  tooltipBorder: string;
  tooltipText: string;
  emptyCell: string;
  cellBorder: string;
}

export function chartPalette(dark: boolean): ChartPalette {
  return dark
    ? {
        grid: '#3a3d2c',
        tick: '#9aa654',
        tooltipBg: '#26261e',
        tooltipBorder: '#b3bd78',
        tooltipText: '#e8e6db',
        emptyCell: '#2c3320',
        cellBorder: 'rgba(255,255,255,0.12)',
      }
    : {
        grid: '#e4e7cf',
        tick: '#525e2e',
        tooltipBg: '#ffffff',
        tooltipBorder: '#33321c',
        tooltipText: '#33321c',
        emptyCell: '#e4e7cf',
        cellBorder: 'rgba(51,50,28,0.12)',
      };
}
