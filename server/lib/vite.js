import { fileURLToPath } from "node:url";
import path, { dirname } from "node:path"; // Agregado dirname y path
import fs from "node:fs"; // Agregado fs
import cookieParser from "cookie-parser";
import longger from 'morgan';

// IMPORTAMOS enrutadores
import indexRouter from "#routes/index.js";
import usersRouter from "#routes/users.js";
import authorRouter from "#routes/author.js";

// 🔧 Solución para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default function viteAssets() {
  const isDev = process.env.NODE_ENV !== 'production';
  const viteDevServer = process.env.VITE_DEV_SERVER || 'http://localhost:5173';

  if (isDev) {
    return `
    <script type="module" src="${viteDevServer}/@vite/client"></script>
    <script type="module" src="${viteDevServer}/src/main.js"></script>
    `;
  }

  // En modo producción
  // Ajusta la ruta del manifest según tu estructura de carpetas
  const manifestPath = path.join(__dirname, '..', '..', 'dist', '.vite', 'manifest.json');

  // Corregido: fs.existsSync en lugar de fstat.existsSync
  if (!fs.existsSync(manifestPath)) {
    console.warn('Vite manifest not found. Run "npm run build" first.');
    return '';
  }

  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const mainEntry = manifest['main.js'];

  if (!mainEntry) {
    console.warn('main.js entry not found in Vite manifest.');
    return '';
  }

  let tags = '';

  // CSS files 
  if (mainEntry.css) {
    mainEntry.css.forEach(cssFile => {
      tags += `<link rel="stylesheet" href="/${cssFile}">`;
    });
  }

  // JS Files
  tags += `<script type="module" src="/${mainEntry.file}"></script>`;
  return tags;
}

// REGISTRAR EL helper de Vite en Handlebars
export function registerViteHelper(hbs) {
  hbs.registerHelper(
    'viteAssets',
    () => new hbs.SafeString(viteAssets())
  );
}