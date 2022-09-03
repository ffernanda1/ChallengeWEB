var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_penjualan_detail', (req, res) => {
  res.render('add')
})


router.post('/add_penjualan_detail', (req, res) => {
  
})

router.get('/delete_penjualan_detail/:id', (req, res) => {
 
})

router.get('/update__penjualan_detail/:id', (req, res) => {
 
})

router.post('/update_penjualan_detail/:id', (req, res) => {
 

})
return router;
}