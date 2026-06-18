export interface User {
  id: string;
  name: string;
  defaultRestSeconds: number;
  startingWeight: number;
  targetWeight: number;
  createdAt: string;
  updatedAt: string;
}

// How an exercise is measured. For non-'reps' metrics the measured quantity is
// stored in WorkoutSet.reps with the unit implied here (time→seconds,
// cardio→minutes, rounds→one round per set); WorkoutSet.weight is the load
// (0 when bodyweight).
export type ExerciseMetric = 'reps' | 'time' | 'cardio' | 'rounds';

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO date (YYYY-MM-DD)
  workoutName: string;
  templateId: string; // '' for ad-hoc sessions
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  metric: ExerciseMetric;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  metric: ExerciseMetric;
  setNumber: number;
  reps: number;
  weight: number;
  completedAt: string;
}

export interface WeightLog {
  id: string;
  userId: string;
  date: string; // ISO date (YYYY-MM-DD)
  weight: number;
  note: string;
  createdAt: string;
}

export interface Setting {
  key: string;
  value: string;
}

export interface BackupData {
  version: number;
  exportedAt: string;
  users: User[];
  workoutSessions: WorkoutSession[];
  exercises: Exercise[];
  workoutSets: WorkoutSet[];
  weightLogs: WeightLog[];
  settings: Setting[];
}
