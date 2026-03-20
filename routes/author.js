//var express = require('express');
import express from 'express';
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('author', {
    name: 'Daniel',
    lastname: 'Rosas', 
    age: 22});
});

//module.exports = router;
export default router;