var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')


router.get('/', function(req, res) {
  res.render('supplier');
  
})

// module.exports = function(pool) {



// /* GET home page. */
// router.get('/supplier', (req, res) => {
//   res.render('supplier');
  
// })

// router.get('/add_supplier', (req, res) => {
//   res.render('add')
// })


// router.post('/add_supplier', (req, res) => {
  
// })

// router.get('/delete_supplier/:id', (req, res) => {
 
// })

// router.get('/update__supplier/:id', (req, res) => {
 
// })

// router.post('/update_supplier/:id', (req, res) => {
 

// })
// return router;
// }

module.exports = router;