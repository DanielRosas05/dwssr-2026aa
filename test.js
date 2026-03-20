import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

//Recreando el __dirname y __filename para que funcionen con ES Modules, 
// ya que no están disponibles de forma nativa como en CommonJS. 
// Esto es necesario para poder usar rutas relativas en el proyecto.
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log(`__dirname: ${__dirname}`);
console.log(`__filename: ${__filename}`);