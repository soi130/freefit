import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserProvider, useUser } from './hooks/useUser';
import BottomNav from './components/BottomNav';
import Today from './pages/Today';
import Settings from './pages/Settings';
import Placeholder from './pages/Placeholder';

function Shell() {
  const { loading } = useUser();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg font-black text-olive-600">Loading…</p>
      </div>
    );
  }

  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-6">
        <Routes>
          <Route path="/" element={<Today />} />
          <Route path="/workout" element={<Placeholder title="Workout" phase="Phase 2" />} />
          <Route path="/progress" element={<Placeholder title="Progress" phase="Phase 4" />} />
          <Route path="/history" element={<Placeholder title="History" phase="Phase 4" />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
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
