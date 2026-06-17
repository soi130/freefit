import { getDB, now } from './index';
import { STORE } from './schema';
import type { User } from '../types';

// Fixed IDs make seeding idempotent even if it runs concurrently
// (e.g. React StrictMode double-invokes effects in dev).
const DEFAULT_USERS: User[] = [
  {
    id: 'seed-user-me',
    name: 'Me',
    defaultRestSeconds: 90,
    startingWeight: 70,
    targetWeight: 68,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: 'seed-user-partner',
    name: 'Partner',
    defaultRestSeconds: 90,
    startingWeight: 55,
    targetWeight: 53,
    createdAt: now(),
    updatedAt: now(),
  },
];

// Seeds the two default profiles on first launch (idempotent).
export async function seedIfEmpty(): Promise<void> {
  const db = await getDB();
  if ((await db.count(STORE.users)) > 0) return;
  const tx = db.transaction(STORE.users, 'readwrite');
  await Promise.all(DEFAULT_USERS.map((u) => tx.objectStore(STORE.users).put(u)));
  await tx.done;
}
