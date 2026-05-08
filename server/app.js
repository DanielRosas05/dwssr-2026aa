import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
//importando winston logger
import logger from './lib/winston.js';
import hbs from 'hbs';


//importando enrutadores
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';
import authorRouter from '#routes/author.js';
//Importando el registradoe de helpers
import { registerViteHelper } from './lib/vite.js';

//import app from '../app.js';
var app = express();

//Recreando variable de path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//Registrando Helpers para el Engine
registerViteHelper(hbs)

//Redirigiendo el flujo del logs de morgan 
//a winston
//mogan---->[logs]---->Winston---->transportes
app.use(morgan('dev',{
  stream:{
   write: (msg)=> logger.http(msg.trim())
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Archivos estaticos
app.use(express.static(path.join(__dirname, '../public')));
//Archivos estativos de vite
if (process.env.NODE_ENV  === "production" ){
  app.use(express.static(path.join(__dirname,'..','dist')));
}
//Archivos estativos del backend
console.log("Ruta:  "+  path.join(__dirname, 'public'));

//registrando las rutas a los enrutadores
app.use(['/','/index'], indexRouter);
app.use('/users', usersRouter);
app.use('/author', authorRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
//eslint-disable-next-line no-unused-vars
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.exports = app;
export default app;