// Web Audio beep + vibration. Mobile browsers block audio until a user gesture,
// so call `enableSound()` from a tap handler once before relying on `beep()`.

let ctx: AudioContext | null = null;

export function isSoundEnabled(): boolean {
  return ctx !== null && ctx.state === 'running';
}

export async function enableSound(): Promise<boolean> {
  try {
    if (!ctx) {
      const Ctor = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      ctx = new Ctor();
    }
    if (ctx.state === 'suspended') await ctx.resume();
    // Play a silent tick to fully unlock audio on iOS.
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    gain.gain.value = 0;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.01);
    return ctx.state === 'running';
  } catch {
    return false;
  }
}

export function beep(durationMs = 250, frequency = 880): void {
  if (!ctx || ctx.state !== 'running') return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  const t = ctx.currentTime;
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + durationMs / 1000);
  osc.connect(gain).connect(ctx.destination);
  osc.start(t);
  osc.stop(t + durationMs / 1000 + 0.02);
}

export function canVibrate(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator;
}

export function vibrate(pattern: number | number[] = [200, 80, 200]): void {
  if (canVibrate()) navigator.vibrate(pattern);
}
