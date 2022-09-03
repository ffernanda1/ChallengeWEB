var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_pembelian_barang', (req, res) => {
  res.render('add')
})


router.post('/add_pembelian_barang', (req, res) => {
  
})

router.get('/delete_pembelian_barang/:id', (req, res) => {
 
})

router.get('/update__pembelian_barang/:id', (req, res) => {
 
})

router.post('/update_pembelian_barang/:id', (req, res) => {
 

})
return router;
}