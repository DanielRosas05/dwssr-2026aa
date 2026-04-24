//
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  root: 'src',

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: '../dist',
    emptyOutDir: true,

    //CREar un manifest.json para que el servidor pueda encontrar los archivos generados
    manifest: true,

    //Configurar Rollup para que el punto de entrada sea main.js
    rolldownOptions: {
      input: {
        main: resolve(__dirname, 'src/main.js'),
      },
    },
  },
});










