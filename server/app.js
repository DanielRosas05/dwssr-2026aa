import createError from 'http-errors';
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import hbs from 'hbs';

//Importando enrutadores
import indexRouter from '#routes/index.js';
import usersRouter from '#routes/users.js';
import authorRouter from '#routes/author.js';
//Importando la función para registrar el helper de Vite
import { registerViteHelper } from './lib/vite.js';

// 🔧 Solución para __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//registrando Helpers para el Engine
registerViteHelper(hbs);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//Archivos estáticos
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'dist')));

  //Archivo estatico del Back-end
  app.use(express.static(path.join(__dirname, '..', 'public')));
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/author', authorRouter);

// catch 404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

export default app;