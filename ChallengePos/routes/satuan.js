var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_satuan', (req, res) => {
  res.render('add')
})


router.post('/add_satuan', (req, res) => {
  
})

router.get('/delete_satuan/:id', (req, res) => {
 
})

router.get('/update__satuan/:id', (req, res) => {
 
})

router.post('/update_satuan/:id', (req, res) => {
 

})
return router;
}