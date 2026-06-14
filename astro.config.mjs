import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://www.wavemarketing.cz',
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    }
  }
});
