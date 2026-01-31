# Middle Earth — Isometric Map

Interactive isometric map of Middle-earth (React + Vite). Drag to pan, hover locations for details.

## Setup

```bash
npm install
```

## Run locally

```bash
npm run dev
```

Open the URL shown (e.g. `http://localhost:5173`).

## Build for a shareable site

```bash
npm run build
```

Output is in `dist/`. Deploy that folder to any static host (Vercel, Netlify, GitHub Pages, etc.).

### GitHub Pages

1. In `vite.config.js`, set `base: '/your-repo-name/'` (e.g. `base: '/lotr-3d-map/'`).
2. Run `npm run build`.
3. In the repo **Settings → Pages**, set source to **GitHub Actions** or deploy the `dist` folder from the **main** branch.

### Preview the build locally

```bash
npm run preview
```

## Project layout

- `middle_earth_map (1).jsx` — main map component (terrain, rivers, locations, Eye of Sauron)
- `src/main.jsx` — entry point, mounts the map
- `index.html` — HTML shell
