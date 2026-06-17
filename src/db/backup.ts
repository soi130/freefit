import { getDB } from './index';
import { STORE } from './schema';
import type { BackupData } from '../types';

const BACKUP_VERSION = 1;

export async function exportAll(): Promise<BackupData> {
  const db = await getDB();
  const [users, workoutSessions, exercises, workoutSets, weightLogs, settings] = await Promise.all([
    db.getAll(STORE.users),
    db.getAll(STORE.workoutSessions),
    db.getAll(STORE.exercises),
    db.getAll(STORE.workoutSets),
    db.getAll(STORE.weightLogs),
    db.getAll(STORE.settings),
  ]);
  return {
    version: BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    users,
    workoutSessions,
    exercises,
    workoutSets,
    weightLogs,
    settings,
  };
}

export function isBackupData(data: unknown): data is BackupData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  return (
    Array.isArray(d.users) &&
    Array.isArray(d.workoutSessions) &&
    Array.isArray(d.exercises) &&
    Array.isArray(d.workoutSets) &&
    Array.isArray(d.weightLogs) &&
    Array.isArray(d.settings)
  );
}

// Replaces all local data with the imported backup.
export async function importAll(data: BackupData): Promise<void> {
  const db = await getDB();
  const stores = Object.values(STORE);
  const tx = db.transaction(stores, 'readwrite');
  await Promise.all(stores.map((s) => tx.objectStore(s).clear()));
  await Promise.all([
    ...data.users.map((r) => tx.objectStore(STORE.users).put(r)),
    ...data.workoutSessions.map((r) => tx.objectStore(STORE.workoutSessions).put(r)),
    ...data.exercises.map((r) => tx.objectStore(STORE.exercises).put(r)),
    ...data.workoutSets.map((r) => tx.objectStore(STORE.workoutSets).put(r)),
    ...data.weightLogs.map((r) => tx.objectStore(STORE.weightLogs).put(r)),
    ...data.settings.map((r) => tx.objectStore(STORE.settings).put(r)),
  ]);
  await tx.done;
}

export async function clearAll(): Promise<void> {
  const db = await getDB();
  const stores = Object.values(STORE);
  const tx = db.transaction(stores, 'readwrite');
  await Promise.all(stores.map((s) => tx.objectStore(s).clear()));
  await tx.done;
}
