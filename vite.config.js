import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: '/RecipApp/', // Cambia esto al nombre de tu repositorio
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});

