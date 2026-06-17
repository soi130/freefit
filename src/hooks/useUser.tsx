import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { User } from '../types';
import { usersRepo } from '../db/repositories';
import { seedIfEmpty } from '../db/seed';
import { requestPersistentStorage } from '../utils/storage';

interface UserContextValue {
  loading: boolean;
  user: User | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  const refreshUser = useCallback(async () => {
    const all = await usersRepo.all();
    setUser(all[0] ?? null);
  }, []);

  useEffect(() => {
    (async () => {
      void requestPersistentStorage();
      await seedIfEmpty();
      await refreshUser();
    })().finally(() => setLoading(false));
  }, [refreshUser]);

  return (
    <UserContext.Provider value={{ loading, user, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
