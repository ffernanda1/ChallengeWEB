var express = require('express');
var router = express.Router();

/* GET home page. */
module.exports = function(db) {
router.get('/', function(req, res, next) {
  const collection = db.collection('challenge22');
  res.render('index', { title: 'Express' });
});

 return router;
}