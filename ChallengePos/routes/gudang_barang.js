var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_gudang', (req, res) => {
  res.render('add')
})


router.post('/add_gudang', (req, res) => {
  
})

router.get('/delete_gudang/:id', (req, res) => {
 
})

router.get('/update__gudang/:id', (req, res) => {
 
})

router.post('/update_gudang/:id', (req, res) => {
 

})
return router;
}