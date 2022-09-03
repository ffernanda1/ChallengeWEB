var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_pembelian_detail', (req, res) => {
  res.render('add')
})


router.post('/add_pembelian_detail', (req, res) => {
  
})

router.get('/delete_pembelian_detail/:id', (req, res) => {
 
})

router.get('/update__pembelian_detail/:id', (req, res) => {
 
})

router.post('/update_pembelian_detail/:id', (req, res) => {
 

})
return router;
}