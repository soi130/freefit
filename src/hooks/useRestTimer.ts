import { useCallback, useEffect, useRef, useState } from 'react';

export interface RestTimer {
  active: boolean; // timer bar is showing (running, paused, or done)
  running: boolean;
  done: boolean; // reached zero, awaiting dismissal
  secondsLeft: number;
  start: (seconds: number) => void;
  pause: () => void;
  resume: () => void;
  addTime: (delta: number) => void;
  reset: () => void;
  skip: () => void;
}

// Countdown driven by an absolute end-timestamp so it stays accurate even when
// the tab is throttled in the background. `onComplete` fires once at zero.
export function useRestTimer(onComplete: () => void): RestTimer {
  const [active, setActive] = useState(false);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const endTimeRef = useRef(0); // ms timestamp; meaningful while running
  const remainingRef = useRef(0); // seconds; meaningful while paused
  const durationRef = useRef(0); // original seconds, for reset
  const runningRef = useRef(false);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const leftFromEnd = () => Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));

  // Ticks while running; recomputes from the end timestamp and fires onComplete.
  useEffect(() => {
    if (!running) return;
    const tick = () => {
      const left = leftFromEnd();
      setSecondsLeft(left);
      if (left <= 0) {
        runningRef.current = false;
        doneRef.current = true;
        setRunning(false);
        setDone(true);
        onCompleteRef.current();
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [running]);

  const start = useCallback((seconds: number) => {
    durationRef.current = seconds;
    endTimeRef.current = Date.now() + seconds * 1000;
    runningRef.current = true;
    doneRef.current = false;
    setSecondsLeft(seconds);
    setDone(false);
    setActive(true);
    setRunning(true);
  }, []);

  const pause = useCallback(() => {
    if (!runningRef.current) return;
    remainingRef.current = leftFromEnd();
    runningRef.current = false;
    setRunning(false);
    setSecondsLeft(remainingRef.current);
  }, []);

  const resume = useCallback(() => {
    if (runningRef.current || doneRef.current) return;
    endTimeRef.current = Date.now() + remainingRef.current * 1000;
    runningRef.current = true;
    setRunning(true);
  }, []);

  const addTime = useCallback((delta: number) => {
    if (!active) return;
    if (doneRef.current) {
      if (delta <= 0) return;
      endTimeRef.current = Date.now() + delta * 1000;
      doneRef.current = false;
      runningRef.current = true;
      setDone(false);
      setSecondsLeft(delta);
      setRunning(true);
      return;
    }
    if (runningRef.current) {
      endTimeRef.current = Math.max(Date.now(), endTimeRef.current + delta * 1000);
      setSecondsLeft(leftFromEnd());
    } else {
      remainingRef.current = Math.max(0, remainingRef.current + delta);
      setSecondsLeft(remainingRef.current);
    }
  }, [active]);

  const reset = useCallback(() => {
    start(durationRef.current);
  }, [start]);

  const skip = useCallback(() => {
    runningRef.current = false;
    doneRef.current = false;
    setRunning(false);
    setDone(false);
    setActive(false);
    setSecondsLeft(0);
  }, []);

  return { active, running, done, secondsLeft, start, pause, resume, addTime, reset, skip };
}
