import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // For GitHub Pages or subpath hosting, set base to your repo name, e.g. base: '/lotr-3d-map/'
  base: '/lotr-3d-map/',
});
