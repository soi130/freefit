import { useRef, useState } from 'react';
import { useUser } from '../hooks/useUser';
import ProfileForm from '../components/forms/ProfileForm';
import {
  enableSound,
  beep,
  vibrate,
  canVibrate,
  isSoundEnabled,
} from '../utils/audio';
import { exportAll, importAll, clearAll, isBackupData } from '../db/backup';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-sm font-black uppercase tracking-wide text-olive-700/70">{title}</h2>
      {children}
    </section>
  );
}

export default function Settings() {
  const { user, refreshUser } = useUser();
  const [soundOn, setSoundOn] = useState(isSoundEnabled());
  const [status, setStatus] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleEnableSound() {
    const ok = await enableSound();
    setSoundOn(ok);
    if (ok) beep(150);
  }

  async function handleExport() {
    const data = await exportAll();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lift-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleImportFile(file: File) {
    try {
      const parsed = JSON.parse(await file.text());
      if (!isBackupData(parsed)) {
        setStatus('Invalid backup file.');
        return;
      }
      await importAll(parsed);
      setStatus('Data imported. Reloading…');
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setStatus('Could not read that file.');
    }
  }

  async function handleClear() {
    if (!confirm('Delete ALL local data on this device? This cannot be undone.')) return;
    await clearAll();
    setStatus('All data cleared. Reloading…');
    setTimeout(() => window.location.reload(), 800);
  }

  return (
    <div className="space-y-7">
      <h1 className="text-2xl font-black text-ink">Settings</h1>

      <Section title="Profile">
        {user && <ProfileForm user={user} onSaved={refreshUser} />}
      </Section>

      <Section title="Sound & vibration">
        <div className="card space-y-3">
          <p className="text-sm font-semibold text-ink/60">
            Mobile browsers block sound until you tap. Enable it once so the rest-timer beep works.
          </p>
          <button className="btn-primary w-full" onClick={handleEnableSound}>
            {soundOn ? 'Sound enabled ✓' : 'Enable sound'}
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="btn-ghost" onClick={() => beep(300)} disabled={!soundOn}>
              Test beep
            </button>
            <button className="btn-ghost" onClick={() => vibrate()} disabled={!canVibrate()}>
              Test vibration
            </button>
          </div>
          {!canVibrate() && (
            <p className="text-xs font-semibold text-ink/40">
              Vibration isn’t supported on this device/browser.
            </p>
          )}
        </div>
      </Section>

      <Section title="Data backup">
        <div className="card space-y-3">
          <button className="btn-ghost w-full" onClick={handleExport}>
            Export all data (JSON)
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImportFile(f);
              e.target.value = '';
            }}
          />
          <button className="btn-ghost w-full" onClick={() => fileRef.current?.click()}>
            Import data from JSON
          </button>
          <button className="btn-brick w-full" onClick={handleClear}>
            Clear all local data
          </button>
          {status && <p className="text-sm font-bold text-olive-700">{status}</p>}
        </div>
      </Section>

      <p className="pb-2 text-center text-xs font-semibold text-ink/40">
        All data stays on this device. No accounts, no cloud, no tracking.
      </p>
    </div>
  );
}
