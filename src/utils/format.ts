import type { ExerciseMetric, WorkoutSet } from '../types';

export function todayISO(): string {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}

export function formatDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatWeight(kg: number): string {
  return `${Number.isInteger(kg) ? kg : kg.toFixed(1)} kg`;
}

export function formatRest(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}

// "m:ss" stopwatch clock for the session timer.
export function formatClock(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

// Short label for a logged set, interpreted by its metric.
export function formatSet(set: WorkoutSet): string {
  const metric: ExerciseMetric = set.metric ?? 'reps';
  if (metric === 'time') return set.weight ? `${set.reps} sec · ${formatWeight(set.weight)}` : `${set.reps} sec`;
  if (metric === 'cardio') return `${set.reps} min`;
  if (metric === 'rounds') return set.weight ? formatWeight(set.weight) : '1 round';
  return set.weight ? `${formatWeight(set.weight)} × ${set.reps}` : `${set.reps} reps`;
}

// Count of items whose ISO date falls in the current Mon–Sun week.
export function startOfWeekISO(ref = new Date()): string {
  const d = new Date(ref);
  const day = (d.getDay() + 6) % 7; // Monday = 0
  d.setDate(d.getDate() - day);
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 10);
}
