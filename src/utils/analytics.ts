import type { WeightLog, WorkoutSession, WorkoutSet } from '../types';

// Volume only counts weighted, rep-based sets; time/cardio/rounds contribute 0.
export function setVolume(s: WorkoutSet): number {
  return (s.metric ?? 'reps') === 'reps' ? s.weight * s.reps : 0;
}

export interface VolumePoint {
  date: string;
  volume: number;
  label: string;
}

export interface WeightPoint {
  date: string;
  weight: number;
}

export interface PersonalRecord {
  exerciseId: string;
  exerciseName: string;
  maxWeight: number;
  repsAtMax: number;
  estOneRepMax: number;
}

// Total volume (Σ weight × reps) per session, oldest first.
export function sessionVolumes(sessions: WorkoutSession[], sets: WorkoutSet[]): VolumePoint[] {
  const bySession = new Map<string, number>();
  for (const s of sets) {
    bySession.set(s.sessionId, (bySession.get(s.sessionId) ?? 0) + setVolume(s));
  }
  return sessions
    .filter((s) => bySession.has(s.id))
    .map((s) => ({ date: s.date, volume: bySession.get(s.id) ?? 0, label: s.workoutName || 'Workout' }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function weightSeries(weights: WeightLog[]): WeightPoint[] {
  return [...weights]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => ({ date: w.date, weight: w.weight }));
}

// Map of ISO date -> number of workouts logged that day.
export function workoutsByDate(sessions: WorkoutSession[], sets: WorkoutSet[]): Map<string, number> {
  const logged = new Set(sets.map((s) => s.sessionId));
  const counts = new Map<string, number>();
  for (const s of sessions) {
    if (!logged.has(s.id)) continue;
    counts.set(s.date, (counts.get(s.date) ?? 0) + 1);
  }
  return counts;
}

// Epley estimated one-rep max.
export function estimateOneRepMax(weight: number, reps: number): number {
  return reps <= 1 ? weight : weight * (1 + reps / 30);
}

// Heaviest set per exercise, with the best estimated 1RM across all its sets.
export function personalRecords(sets: WorkoutSet[]): PersonalRecord[] {
  const byExercise = new Map<string, PersonalRecord>();
  for (const s of sets) {
    if ((s.metric ?? 'reps') !== 'reps' || s.weight <= 0) continue;
    const e1rm = estimateOneRepMax(s.weight, s.reps);
    const current = byExercise.get(s.exerciseId);
    if (!current) {
      byExercise.set(s.exerciseId, {
        exerciseId: s.exerciseId,
        exerciseName: s.exerciseName,
        maxWeight: s.weight,
        repsAtMax: s.reps,
        estOneRepMax: e1rm,
      });
      continue;
    }
    if (s.weight > current.maxWeight) {
      current.maxWeight = s.weight;
      current.repsAtMax = s.reps;
    }
    if (e1rm > current.estOneRepMax) current.estOneRepMax = e1rm;
  }
  return [...byExercise.values()].sort((a, b) => a.exerciseName.localeCompare(b.exerciseName));
}
