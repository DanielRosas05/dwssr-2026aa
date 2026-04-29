// Importo la duncion de configuracion de Vite
import { defineConfig } from 'vite';
// Importo un resolvedor de rutas
import { resolve } from 'path';
// Importando TAILWINDCSS
import tailwindcss from 'tailwindcss';
export default defineConfig({
  root: 'src',
  // plugins: [tailwindcss()]
  plugins : [tailwindcss()],

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










