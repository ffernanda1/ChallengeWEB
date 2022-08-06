var express = require('express');
var router = express.Router();

module.exports = function() {

const collection = db.collection('challenge');

router.get('/', function(req, res, next) {
  try{
  const findResult = await collection.find({}).toArray(
    res.status(200).json(findResult)
  )} catch(e) {
    res.json(e)
  }
});

 return router;
}