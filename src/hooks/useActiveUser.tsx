import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { usersRepo, settingsRepo } from '../db/repositories';
import { seedIfEmpty } from '../db/seed';

const ACTIVE_USER_KEY = 'activeUserId';

interface ActiveUserContextValue {
  loading: boolean;
  users: User[];
  activeUser: User | null;
  setActiveUser: (id: string) => Promise<void>;
  refreshUsers: () => Promise<void>;
}

const ActiveUserContext = createContext<ActiveUserContextValue | null>(null);

export function ActiveUserProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const load = useCallback(async () => {
    await seedIfEmpty();
    const all = await usersRepo.all();
    setUsers(all);
    const stored = await settingsRepo.get(ACTIVE_USER_KEY);
    const valid = stored && all.some((u) => u.id === stored) ? stored : all[0]?.id ?? null;
    setActiveId(valid);
    if (valid && valid !== stored) await settingsRepo.set(ACTIVE_USER_KEY, valid);
  }, []);

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  const setActiveUser = useCallback(async (id: string) => {
    setActiveId(id);
    await settingsRepo.set(ACTIVE_USER_KEY, id);
  }, []);

  const refreshUsers = useCallback(async () => {
    setUsers(await usersRepo.all());
  }, []);

  const activeUser = users.find((u) => u.id === activeId) ?? null;

  return (
    <ActiveUserContext.Provider
      value={{ loading, users, activeUser, setActiveUser, refreshUsers }}
    >
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser(): ActiveUserContextValue {
  const ctx = useContext(ActiveUserContext);
  if (!ctx) throw new Error('useActiveUser must be used within ActiveUserProvider');
  return ctx;
}
