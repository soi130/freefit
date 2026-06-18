# Personal Lift Tracker

A private, **local-first** workout and body-weight tracker. Mobile-first,
installable as a PWA — no login, no backend, no cloud sync. All data lives in
your browser (IndexedDB) on the device you use.

## Tech stack

- Vite + React + TypeScript
- Tailwind CSS (Olive + Brick pastel theme)
- IndexedDB via [`idb`](https://github.com/jakearchibald/idb)
- Recharts (volume / weight / consistency charts)
- `vite-plugin-pwa` (installable, offline-capable PWA)

## Getting started

```bash
npm install
npm run dev        # start dev server (http://localhost:5173)
```

Other scripts:

```bash
npm run build      # type-check + production build to dist/
npm run preview    # preview the production build locally
npm run typecheck  # type-check only
npm run gen-icons  # regenerate PWA icons from the dumbbell SVG (needs sharp)
```

## Data & privacy

- Everything is stored locally in IndexedDB; nothing leaves the device.
- To move data to another phone, use **Settings → Export** to download a JSON
  backup, then **Import** on the other device.
- **Clear all data** wipes everything (with confirmation).

## Deploy to Vercel

The app is a static SPA — any static host works. For Vercel:

1. Push this repo to GitHub (already wired to `origin`).
2. In Vercel, **New Project → Import** this repo. The **Vite** preset is detected
   automatically (build `npm run build`, output `dist`).
3. Deploy. `vercel.json` rewrites all routes to `index.html` so client-side deep
   links resolve. Open the URL on your phone and **Add to Home Screen** to install.

From the CLI instead:

```bash
npm i -g vercel
vercel        # preview deploy
vercel --prod # production deploy
```

No environment variables or backend are required.
