export interface User {
  id: string;
  name: string;
  defaultRestSeconds: number;
  startingWeight: number;
  targetWeight: number;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO date (YYYY-MM-DD)
  workoutName: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exercise {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSet {
  id: string;
  sessionId: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
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
