import { getDB, now } from './index';
import { STORE } from './schema';
import type { User } from '../types';

// Single local profile (this app runs one user per device).
// Fixed ID makes seeding idempotent even under React StrictMode double-invoke.
const DEFAULT_USER: User = {
  id: 'local-user',
  name: '',
  defaultRestSeconds: 90,
  startingWeight: 70,
  targetWeight: 68,
  createdAt: now(),
  updatedAt: now(),
};

// Seeds the local profile on first launch (idempotent).
export async function seedIfEmpty(): Promise<void> {
  const db = await getDB();
  if ((await db.count(STORE.users)) > 0) return;
  await db.put(STORE.users, DEFAULT_USER);
}
