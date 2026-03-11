var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('author', {
    name: 'Daniel',
    lastname: 'Rosas', 
    age: 22});
});

module.exports = router;