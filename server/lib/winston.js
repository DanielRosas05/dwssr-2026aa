//Importar libreria winston
import winston, { format } from "winston";
import path from "node:path";
import fs from "node:fs";
// Importamos biblioteca de transporte 
import DailyRotateFile from "winston-daily-rotate-file";

// Desestructuramos funciones format
const { combine, timestamp, label, printf, colorize, prettyPrint } = format;

//Creando los directorios
const __rootdir = path.resolve(process.cwd());

// Creando la ruta del directorio de logs en la raiz del proyecto
const logsDir = path.join(__rootdir, "logs");
// Rurina que crea la carpeta donde iran los logs si no existe
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Definiendo esquma de colores para cada nivel de log
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "blue",
};

// Agregamos los colores a winston
winston.addColors(colors);

// Creando el formato de salida para los diferentes transportes
const myConsoleFormat = combine(
  //Agregamos color a la salida de consola
  colorize({ all: true }),
  // Agregamos una etiquea Log
  label({ label: "📢" }),
  // Agregamos un timestamp a cada log
  timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
  // Agregamos un formato personalizado para la salida de consola
  printf(
    (info) =>
      `${info.level}: ${info.label}: ${info.timestamp}: ${info.message}`,
  ),
);
// Formato para los archivos de log
const myFileFormat = combine(
  // Quitamos los colores para los archivos de log
  format.uncolorize(),
  // Agregamos fecha en formato ISO
  timestamp(),
  // Salida en formato JSON para los archivos de log
  format.json(),
);

// Creando el objeto de opciones para cada transporte
const options = {
  errorFile: {
    level: "error",
    filename: path.join(__rootdir, "logs", "error.log"),
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    format: myFileFormat,
  },
  console: {
    level: "debug",
    handleExceptions: true,
    format: myConsoleFormat,
  },
  readableFile: {
    filename: path.join(logsDir, "app-readable.log"),
    level: "info",
    format: combine(
      format.uncolorize(),
      timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      prettyPrint(),
    ),
    maxsize: 5242880,
    maxFiles: 5,
  },
  dailyRotateFile: {
    filename: path.join(logsDir, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    level: "info",
    format: myFileFormat,
  },
};

// Creando el una instancia del Logger
/*
Usaremos un transpot diario (DailyRotateFile) para el log principal,
esto facilita a retencion por fecha y la compresion de archivos.

Para los demas logd mantenmos archivos separados.
*/
const logger = winston.createLogger({
  transports: [
    // Log principal con rotacion diaria
    new DailyRotateFile(options.dailyRotateFile),
    // Log legible para humanos
    new winston.transports.File(options.readableFile),
    // Log de errores
    new winston.transports.File(options.errorFile),
    // Log en consola
    new winston.transports.Console(options.console),
  ],
  // Captura de excepciones
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "exceptions.log"),
    }),
  ],
  rejectioHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, "rejection.log"),
    }),
  ],
  exitOnError: false, // No salir en caso de error
});
//Finalmente exportamos el logger
export default logger;
