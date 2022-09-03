var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_barang', (req, res) => {
  res.render('add')
})


router.post('/add_barang', (req, res) => {
  
})

router.get('/delete_barang/:id', (req, res) => {
 
})

router.get('/update__barang/:id', (req, res) => {
 
})

router.post('/update_barang/:id', (req, res) => {
 

})
return router;
}
