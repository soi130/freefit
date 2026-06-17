import { useState } from 'react';
import { weightRepo } from '../../db/repositories';
import { validateBodyWeight } from '../../utils/validation';
import { todayISO } from '../../utils/format';

export default function WeightForm({
  userId,
  onSaved,
}: {
  userId: string;
  onSaved: () => void;
}) {
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(todayISO());
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    const value = Number(weight);
    const check = validateBodyWeight(value);
    if (!check.ok) {
      setError(check.error);
      return;
    }
    await weightRepo.create({ userId, date, weight: value, note: note.trim() });
    onSaved();
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="label">Weight (kg)</label>
        <input
          className="input"
          type="number"
          inputMode="decimal"
          step="0.1"
          placeholder="e.g. 70.5"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
            setError('');
          }}
          autoFocus
        />
      </div>
      <div>
        <label className="label">Date</label>
        <input
          className="input"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        <label className="label">Note (optional)</label>
        <input
          className="input"
          type="text"
          placeholder="e.g. morning, fasted"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>
      {error && <p className="text-sm font-bold text-brick-500">{error}</p>}
      <button className="btn-primary w-full" onClick={submit}>
        Save weight
      </button>
    </div>
  );
}
