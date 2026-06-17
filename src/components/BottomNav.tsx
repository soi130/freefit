import { NavLink } from 'react-router-dom';
import {
  TodayIcon,
  WorkoutIcon,
  ProgressIcon,
  HistoryIcon,
  SettingsIcon,
} from './icons';

const tabs = [
  { to: '/', label: 'Today', Icon: TodayIcon, end: true },
  { to: '/workout', label: 'Workout', Icon: WorkoutIcon, end: false },
  { to: '/progress', label: 'Progress', Icon: ProgressIcon, end: false },
  { to: '/history', label: 'History', Icon: HistoryIcon, end: false },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon, end: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 border-t-2 border-ink bg-cream/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-1 pb-[env(safe-area-inset-bottom)]">
        {tabs.map(({ to, label, Icon, end }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] font-extrabold transition-colors ${
                  isActive ? 'text-brick-500' : 'text-olive-700/70'
                }`
              }
            >
              <Icon width={26} height={26} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
