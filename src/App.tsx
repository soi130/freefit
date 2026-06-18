import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './hooks/useUser';
import BottomNav from './components/BottomNav';
import Today from './pages/Today';
import Workout from './pages/Workout';
import History from './pages/History';
import Settings from './pages/Settings';

// Progress pulls in recharts; load it on demand to keep the initial bundle small.
const Progress = lazy(() => import('./pages/Progress'));

function Shell() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg font-black text-accent">Loading…</p>
      </div>
    );
  }

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-6">
        <Suspense fallback={<p className="py-24 text-center font-black text-accent">Loading…</p>}>
          <Routes>
            <Route path="/" element={<Today />} />
            <Route path="/workout" element={<Workout />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Suspense>
      </div>
      <BottomNav />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <UserProvider>
      <Shell />
    </UserProvider>
  );
}
