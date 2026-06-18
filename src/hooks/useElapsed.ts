import { useEffect, useState } from 'react';

// Seconds elapsed since `startISO`, ticking once per second. Derived from the
// absolute start time so it stays accurate across reloads and backgrounding.
export function useElapsed(startISO: string | null): number {
  const [seconds, setSeconds] = useState(() => elapsedFrom(startISO));

  useEffect(() => {
    if (!startISO) return;
    setSeconds(elapsedFrom(startISO));
    const id = setInterval(() => setSeconds(elapsedFrom(startISO)), 1000);
    return () => clearInterval(id);
  }, [startISO]);

  return seconds;
}

function elapsedFrom(startISO: string | null): number {
  if (!startISO) return 0;
  const start = new Date(startISO).getTime();
  return Math.max(0, Math.floor((Date.now() - start) / 1000));
}
