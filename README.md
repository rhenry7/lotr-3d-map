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
2. In the repo **Settings → Pages**, set source to **GitHub Actions**.
3. Push your code (including the `.github/workflows/deploy-pages.yml` file). A workflow will run on every push to `main`, build the site, and deploy it.
4. **Go to your site:**  
   **`https://<your-username>.github.io/lotr-3d-map/`**  
   (Replace `<your-username>` with your GitHub username.)  
   The first deploy can take 1–2 minutes after the workflow finishes. If you get a 404, wait a minute and refresh, or check **Actions** in the repo to see the deploy status.

### Preview the build locally

```bash
npm run preview
```

## Project layout

- `middle_earth_map (1).jsx` — main map component (terrain, rivers, locations, Eye of Sauron)
- `src/main.jsx` — entry point, mounts the map
- `index.html` — HTML shell
