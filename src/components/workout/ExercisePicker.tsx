import { useState } from 'react';
import type { Exercise } from '../../types';

export default function ExercisePicker({
  exercises,
  activeIds,
  onPick,
}: {
  exercises: Exercise[];
  activeIds: string[];
  onPick: (name: string) => void;
}) {
  const [query, setQuery] = useState('');
  const trimmed = query.trim();

  const matches = exercises
    .filter((e) => e.name.toLowerCase().includes(trimmed.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  const exactMatch = exercises.some((e) => e.name.toLowerCase() === trimmed.toLowerCase());

  return (
    <div className="space-y-3">
      <input
        className="input"
        type="text"
        placeholder="Search or type a new exercise"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        autoFocus
      />

      {trimmed && !exactMatch && (
        <button className="btn-primary w-full" onClick={() => onPick(trimmed)}>
          Create “{trimmed}”
        </button>
      )}

      <div className="max-h-64 space-y-2 overflow-y-auto">
        {matches.map((e) => {
          const added = activeIds.includes(e.id);
          return (
            <button
              key={e.id}
              className="btn-ghost w-full justify-between"
              disabled={added}
              onClick={() => onPick(e.name)}
            >
              <span>{e.name}</span>
              {added && <span className="text-xs font-bold text-olive-600">Added</span>}
            </button>
          );
        })}
        {matches.length === 0 && !trimmed && (
          <p className="py-4 text-center text-sm font-semibold text-ink/50">
            No exercises yet. Type one above to create it.
          </p>
        )}
      </div>
    </div>
  );
}
