import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2.2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
};

export const TodayIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 3v2M5 5h14a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" />
    <path d="M4 9h16M9 13h6M9 16h3" />
  </svg>
);

export const WorkoutIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M6.5 6.5 17.5 17.5M4 8l2-2 2 2-2 2zM16 20l2-2 2-2-2-2-2 2z" />
    <path d="M7 17 4 20M17 7l3-3" />
  </svg>
);

export const ProgressIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 19V5M4 19h16M8 16l3-4 3 2 4-6" />
  </svg>
);

export const HistoryIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7M3 5v4h4M12 8v4l3 2" />
  </svg>
);

export const SettingsIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2M12 19v2M5 5l1.5 1.5M17.5 17.5 19 19M3 12h2M19 12h2M5 19l1.5-1.5M17.5 6.5 19 5" />
  </svg>
);

export const PlusIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const ScaleIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <rect x="4" y="4" width="16" height="16" rx="3" />
    <path d="M12 8a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3ZM12 8V6" />
  </svg>
);

export const TrashIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-12M10 11v6M14 11v6" />
  </svg>
);

export const CheckIcon = (p: IconProps) => (
  <svg {...base} {...p}>
    <path d="M5 13l4 4L19 7" />
  </svg>
);
