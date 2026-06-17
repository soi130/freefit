import { useActiveUser } from '../hooks/useActiveUser';

export default function UserSwitcher() {
  const { users, activeUser, setActiveUser } = useActiveUser();
  if (users.length === 0) return null;

  return (
    <div className="flex gap-2 rounded-card border-2 border-ink bg-white p-1 shadow-stroke-sm">
      {users.map((u) => {
        const active = u.id === activeUser?.id;
        return (
          <button
            key={u.id}
            onClick={() => setActiveUser(u.id)}
            className={`flex-1 rounded-[0.9rem] px-3 py-2 text-sm font-extrabold transition-colors ${
              active ? 'bg-olive-500 text-white' : 'text-olive-700'
            }`}
          >
            {u.name}
          </button>
        );
      })}
    </div>
  );
}
