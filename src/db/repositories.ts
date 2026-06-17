import { getDB, newId, now } from './index';
import { STORE } from './schema';
import type {
  User,
  WorkoutSession,
  Exercise,
  WorkoutSet,
  WeightLog,
  Setting,
} from '../types';

// ---- Users ----
export const usersRepo = {
  async all(): Promise<User[]> {
    return (await getDB()).getAll(STORE.users);
  },
  async get(id: string): Promise<User | undefined> {
    return (await getDB()).get(STORE.users, id);
  },
  async create(input: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const user: User = { ...input, id: newId(), createdAt: now(), updatedAt: now() };
    await (await getDB()).put(STORE.users, user);
    return user;
  },
  async update(id: string, patch: Partial<Omit<User, 'id' | 'createdAt'>>): Promise<User> {
    const db = await getDB();
    const existing = await db.get(STORE.users, id);
    if (!existing) throw new Error(`User ${id} not found`);
    const updated: User = { ...existing, ...patch, updatedAt: now() };
    await db.put(STORE.users, updated);
    return updated;
  },
};

// ---- Sessions ----
export const sessionsRepo = {
  async byUser(userId: string): Promise<WorkoutSession[]> {
    const rows = await (await getDB()).getAllFromIndex(STORE.workoutSessions, 'by-user', userId);
    return rows.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt));
  },
  async get(id: string): Promise<WorkoutSession | undefined> {
    return (await getDB()).get(STORE.workoutSessions, id);
  },
  async create(
    input: Omit<WorkoutSession, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<WorkoutSession> {
    const session: WorkoutSession = { ...input, id: newId(), createdAt: now(), updatedAt: now() };
    await (await getDB()).put(STORE.workoutSessions, session);
    return session;
  },
  async update(
    id: string,
    patch: Partial<Omit<WorkoutSession, 'id' | 'createdAt'>>,
  ): Promise<WorkoutSession> {
    const db = await getDB();
    const existing = await db.get(STORE.workoutSessions, id);
    if (!existing) throw new Error(`Session ${id} not found`);
    const updated: WorkoutSession = { ...existing, ...patch, updatedAt: now() };
    await db.put(STORE.workoutSessions, updated);
    return updated;
  },
  async delete(id: string): Promise<void> {
    await (await getDB()).delete(STORE.workoutSessions, id);
  },
};

// ---- Exercises ----
export const exercisesRepo = {
  async byUser(userId: string): Promise<Exercise[]> {
    return (await getDB()).getAllFromIndex(STORE.exercises, 'by-user', userId);
  },
  async create(input: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Promise<Exercise> {
    const ex: Exercise = { ...input, id: newId(), createdAt: now(), updatedAt: now() };
    await (await getDB()).put(STORE.exercises, ex);
    return ex;
  },
  async findOrCreate(userId: string, name: string): Promise<Exercise> {
    const trimmed = name.trim();
    const existing = (await exercisesRepo.byUser(userId)).find(
      (e) => e.name.toLowerCase() === trimmed.toLowerCase(),
    );
    return existing ?? exercisesRepo.create({ userId, name: trimmed });
  },
};

// ---- Sets ----
export const setsRepo = {
  async bySession(sessionId: string): Promise<WorkoutSet[]> {
    const rows = await (await getDB()).getAllFromIndex(STORE.workoutSets, 'by-session', sessionId);
    return rows.sort((a, b) => a.completedAt.localeCompare(b.completedAt));
  },
  async byUser(userId: string): Promise<WorkoutSet[]> {
    return (await getDB()).getAllFromIndex(STORE.workoutSets, 'by-user', userId);
  },
  async create(input: Omit<WorkoutSet, 'id'>): Promise<WorkoutSet> {
    const set: WorkoutSet = { ...input, id: newId() };
    await (await getDB()).put(STORE.workoutSets, set);
    return set;
  },
  async delete(id: string): Promise<void> {
    await (await getDB()).delete(STORE.workoutSets, id);
  },
  async deleteBySession(sessionId: string): Promise<void> {
    const db = await getDB();
    const rows = await db.getAllFromIndex(STORE.workoutSets, 'by-session', sessionId);
    await Promise.all(rows.map((r) => db.delete(STORE.workoutSets, r.id)));
  },
  // Sets from the most recent *other* session in which this exercise was done.
  async previousForExercise(
    userId: string,
    exerciseId: string,
    excludeSessionId: string,
  ): Promise<WorkoutSet[]> {
    const db = await getDB();
    const rows = await db.getAllFromIndex(STORE.workoutSets, 'by-user-exercise', [
      userId,
      exerciseId,
    ]);
    const others = rows.filter((r) => r.sessionId !== excludeSessionId);
    if (others.length === 0) return [];
    const latest = others.reduce((a, b) => (b.completedAt > a.completedAt ? b : a));
    return others
      .filter((r) => r.sessionId === latest.sessionId)
      .sort((a, b) => a.setNumber - b.setNumber);
  },
};

// ---- Weight logs ----
export const weightRepo = {
  async byUser(userId: string): Promise<WeightLog[]> {
    const rows = await (await getDB()).getAllFromIndex(STORE.weightLogs, 'by-user', userId);
    return rows.sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));
  },
  async latest(userId: string): Promise<WeightLog | undefined> {
    const rows = await weightRepo.byUser(userId);
    return rows[rows.length - 1];
  },
  async create(input: Omit<WeightLog, 'id' | 'createdAt'>): Promise<WeightLog> {
    const log: WeightLog = { ...input, id: newId(), createdAt: now() };
    await (await getDB()).put(STORE.weightLogs, log);
    return log;
  },
};

// ---- Settings (key/value) ----
export const settingsRepo = {
  async get(key: string): Promise<string | undefined> {
    return (await (await getDB()).get(STORE.settings, key))?.value;
  },
  async set(key: string, value: string): Promise<void> {
    const row: Setting = { key, value };
    await (await getDB()).put(STORE.settings, row);
  },
  async all(): Promise<Setting[]> {
    return (await getDB()).getAll(STORE.settings);
  },
};
