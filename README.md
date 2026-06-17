# Personal Lift Tracker

A private, **local-first** workout and body-weight tracker for two people. Mobile-first, installable as a PWA, no login, no backend, no cloud sync. All data lives in your browser (IndexedDB) on the device you use.

> **Build status:** Phase 1 — project scaffold, IndexedDB data layer, Today screen, and Settings (profiles, sound test, JSON backup). Workout logging, rest timer, charts, and history come in later phases.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS (Olive + Brick pastel theme)
- IndexedDB via [`idb`](https://github.com/jakearchibald/idb)
- Recharts (charts, used from Phase 4)
- `vite-plugin-pwa` (installable PWA)

## Getting started

```bash
npm install        # also generates placeholder PWA icons (postinstall)
npm run dev        # start dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run typecheck  # type-check only
```

On first launch the app seeds two profiles, **Me** and **Partner**. Switch between
them on the Today screen — each profile's data is fully separate.

## Data & privacy

- Everything is stored locally in IndexedDB; nothing leaves the device.
- To move data to another phone, use **Settings → Export all data** then
  **Import data** on the other device.
- **Clear all local data** wipes both profiles (with confirmation).

## Deploy to Vercel

1. Push this repo to GitHub (already wired to `origin`).
2. In Vercel, **New Project → Import** this repo.
3. Framework preset: **Vite**. Build command `npm run build`, output dir `dist`.
4. Deploy. Open the URL on your iPhone and "Add to Home Screen" to install.

No environment variables or backend are required.

## Project structure

```
src/
  components/        UI: BottomNav, StatCard, Sheet, UserSwitcher, icons
  components/forms/  WeightForm, UserEditForm
  components/timer/  (Phase 3)
  components/charts/ (Phase 4)
  db/                schema, connection, repositories, seed, backup
  hooks/             useActiveUser (context), useAsync
  pages/             Today, Settings, Placeholder (Workout/Progress/History)
  utils/             validation, audio, format
  types/             entity interfaces
  App.tsx, main.tsx
```
