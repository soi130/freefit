import type { DBSchema } from 'idb';
import type {
  User,
  WorkoutSession,
  Exercise,
  WorkoutSet,
  WeightLog,
  Setting,
} from '../types';

export const DB_NAME = 'personal-lift-tracker';
export const DB_VERSION = 1;

export const STORE = {
  users: 'users',
  workoutSessions: 'workoutSessions',
  exercises: 'exercises',
  workoutSets: 'workoutSets',
  weightLogs: 'weightLogs',
  settings: 'settings',
} as const;

export interface LiftDB extends DBSchema {
  users: {
    key: string;
    value: User;
  };
  workoutSessions: {
    key: string;
    value: WorkoutSession;
    indexes: { 'by-user': string; 'by-user-date': [string, string] };
  };
  exercises: {
    key: string;
    value: Exercise;
    indexes: { 'by-user': string };
  };
  workoutSets: {
    key: string;
    value: WorkoutSet;
    indexes: { 'by-session': string; 'by-user': string; 'by-user-exercise': [string, string] };
  };
  weightLogs: {
    key: string;
    value: WeightLog;
    indexes: { 'by-user': string; 'by-user-date': [string, string] };
  };
  settings: {
    key: string;
    value: Setting;
  };
}
