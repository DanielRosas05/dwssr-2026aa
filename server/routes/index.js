import express, { response } from "express";
const router = express.Router();
//Importando el logger de Winston
import logger from "../lib/winston.js";
/* GET home page. */
// eslint-disable-next-line no-unused-vars
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Proyecto Asombroso💫",
    author: "Daniel Rosas",
  });
});

// Rutas para pruebas de logs
router.get("/test-log", (req, res) => {
  //Generando logs de prueba
  logger.info("Este es un log de información");
  logger.warn("Este es un log de advertencia");
  logger.error("Este es un log de error");
  logger.debug("Este es un log de depuración");
  /*res.send('Logs generados correctamente');*/
  // Estructurando respuesta
  res.json({
    message: "Se crearon logs de prueba en la ruta /testlogs",
    archivos: [
      "logs/app-YYYY-MM-DD.log",
      "logs/app-readble.log",
      "logs/error.log",
    ],
  });
});
// Rutas para prueba de exception y rejection
if (process.env.NODE_ENV !== "production") {
  //Habilitar ruta para probar exceptionHandler
  // Acceso: Get /test-exception
  router.get("/test-exception", (req, res) => {
    res.json({
      message: "Excepcion lanzada. Revisa logs/exceptions.log",
    });
    //Lanzar una excepción no capturada
    setTimeout(() => {
      throw new Error("Excepción de prueba no capturada");
    }, 300);
  });
  // Ruta para rejection
  // Acceso: Get /test-rejection
  router.get("/test-rejection", (req, res) => {
    res.json({
      message: "Rechazo de promesa. Revisa logs/rejections.log",
    }); 
    // Generando Rejection
    Promise.reject(new Error("Rechazo de promesa sin catch"));
  });
}

export default router;
