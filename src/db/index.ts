import { openDB, type IDBPDatabase } from 'idb';
import { DB_NAME, DB_VERSION, STORE, type LiftDB } from './schema';

let dbPromise: Promise<IDBPDatabase<LiftDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<LiftDB>> {
  if (!dbPromise) {
    dbPromise = openDB<LiftDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore(STORE.users, { keyPath: 'id' });

        const sessions = db.createObjectStore(STORE.workoutSessions, { keyPath: 'id' });
        sessions.createIndex('by-user', 'userId');
        sessions.createIndex('by-user-date', ['userId', 'date']);

        const exercises = db.createObjectStore(STORE.exercises, { keyPath: 'id' });
        exercises.createIndex('by-user', 'userId');

        const sets = db.createObjectStore(STORE.workoutSets, { keyPath: 'id' });
        sets.createIndex('by-session', 'sessionId');
        sets.createIndex('by-user', 'userId');
        sets.createIndex('by-user-exercise', ['userId', 'exerciseId']);

        const weights = db.createObjectStore(STORE.weightLogs, { keyPath: 'id' });
        weights.createIndex('by-user', 'userId');
        weights.createIndex('by-user-date', ['userId', 'date']);

        db.createObjectStore(STORE.settings, { keyPath: 'key' });
      },
    });
  }
  return dbPromise;
}

export function newId(): string {
  return crypto.randomUUID();
}

export function now(): string {
  return new Date().toISOString();
}
