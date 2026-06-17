import { useState } from 'react';
import type { User } from '../../types';
import { usersRepo } from '../../db/repositories';
import {
  validateName,
  validateRestSeconds,
  validateBodyWeight,
} from '../../utils/validation';

export default function UserEditForm({
  user,
  onSaved,
}: {
  user: User;
  onSaved: () => void;
}) {
  const [name, setName] = useState(user.name);
  const [rest, setRest] = useState(String(user.defaultRestSeconds));
  const [start, setStart] = useState(String(user.startingWeight));
  const [target, setTarget] = useState(String(user.targetWeight));
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function submit() {
    const checks = [
      validateName(name),
      validateRestSeconds(Number(rest)),
      validateBodyWeight(Number(start)),
      validateBodyWeight(Number(target)),
    ];
    const bad = checks.find((c) => !c.ok);
    if (bad && !bad.ok) {
      setError(bad.error);
      return;
    }
    await usersRepo.update(user.id, {
      name: name.trim(),
      defaultRestSeconds: Number(rest),
      startingWeight: Number(start),
      targetWeight: Number(target),
    });
    setError('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    onSaved();
  }

  return (
    <div className="card space-y-3">
      <div>
        <label className="label">Name</label>
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Rest (sec)</label>
          <input
            className="input"
            type="number"
            inputMode="numeric"
            value={rest}
            onChange={(e) => setRest(e.target.value)}
          />
        </div>
        <div />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label">Start (kg)</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>
        <div>
          <label className="label">Target (kg)</label>
          <input
            className="input"
            type="number"
            inputMode="decimal"
            step="0.1"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </div>
      {error && <p className="text-sm font-bold text-brick-500">{error}</p>}
      <button className="btn-primary w-full" onClick={submit}>
        {saved ? 'Saved ✓' : 'Save changes'}
      </button>
    </div>
  );
}
