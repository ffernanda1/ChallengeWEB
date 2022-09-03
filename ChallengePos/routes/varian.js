var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  
})

router.get('/add_varian', (req, res) => {
  res.render('add')
})


router.post('/add_varian', (req, res) => {
  
})

router.get('/delete_varian/:id', (req, res) => {
 
})

router.get('/update__varian/:id', (req, res) => {
 
})

router.post('/update_varian/:id', (req, res) => {
 

})
return router;
}