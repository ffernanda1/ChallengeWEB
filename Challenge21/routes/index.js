var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function(pool) {



/* GET home page. */
router.get('/', (req, res) => {
  const url = req.url == '/' ? '/?page=1' : req.url
  const page = parseInt(req.query.page) || 1
  const limit = 3
  const offset = (page - 1) * limit
  const search = []
  const hasil = []
  
  var count = 1


  //Searching
  if (req.query.String) {
    search.push(`strings ILIKE '%'||$${count}||'%' `)
    count++
    hasil.push(req.query.String)
  }

  if (req.query.Integer) {
    search.push(`integers = $${count}`)
    count++
    hasil.push(req.query.Integer)
  }

  if (req.query.Float) {
    search.push(`floats = $${count}`)
    count++
    hasil.push(req.query.Float)
  }

  if (req.query.Date && req.query.Date2) {
    search.push(`dates BETWEEN $${count} AND $${count + 1}`)
    count++
    count++
    hasil.push(`${req.query.Date}`,`${req.query.Date2}`)
    console.log(hasil)
  } else if (req.query.Date) {
    search.push(`dates >= $${count}`)
    count++
    hasil.push(`${req.query.Date}`)
  } else if (req.query.Date2) {
    search.push(`dates <= $${count}`)
    count++
    hasil.push(`${req.query.Date2}`)
  }

  if(req.query.Boolean) {
    search.push(`booleans = $${count}`)
    count++
    hasil.push(req.query.Boolean)
  }

  //format command Searching
  let sql = 'SELECT COUNT(*) AS total FROM ch21';
  if (search.length > 0) {
    sql += ` WHERE ${search.join(' and ')}`
  }

  pool.query(sql, hasil, (err, data) => {
    if (err) console.log(err)
    
    const pages = Math.ceil(data.rows[0].total / limit)

    sql = 'SELECT * FROM ch21'
    if (search.length > 0) {
      sql += ` WHERE  ${search.join(' and  ')}`
    }

    sql += ` LIMIT $${count} OFFSET $${count + 1}`
    pool.query(sql, [...hasil, limit, offset], (err, data) => {
      console.log(sql)
      res.render('list', { list: data.rows, pages, page, offset, moment, url, query: req.query })
    })
  })
})

router.get('/add', (req, res) => {
  res.render('add')
})

var count2 = 1
router.post('/add', (req, res) => {
  pool.query(`INSERT INTO ch21 (strings, integers, floats, dates, booleans) VALUES ($${count2},$${count2 + 1},$${count2 + 2},$${count2 + 3},$${count2 + 4})`,
  [req.body.Strings,
    parseInt(req.body.Integers),
    parseFloat(req.body.Floats),
    `${moment(req.body.Dates).format('YYYY-MM-DD')}`,
    req.body.Booleans]
  ) 

  [req.body.Strings,
    parseInt(req.body.Integers),
    parseFloat(req.body.Floats),
    `${moment(req.body.Dates).format('YYYY-MM-DD')}`,
    req.body.Booleans]
  res.redirect('/')
  
})

router.get('/delete/:id', (req, res) => {
  let id = req.params.id
  
  let sql = `DELETE FROM ch21 WHERE id= $1`
  
  pool.query(sql, [id])
  res.redirect('/')
})

router.get('/update/:id', (req, res) => {
  let id = req.params.id
  var count4 = 1
  let sql = `SELECT * FROM ch21 WHERE id= $${count4}`;

  pool.query(sql, [id], (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.render('edit', { item: data.rows[0], moment })
      
    }
  })
})

router.post('/update/:id', (req, res) => {
  var count4 = 1
  
  let sql = `UPDATE ch21 SET 
  strings = $1,
  integers = $2,
  floats = $3,
  dates = $4,
  booleans = $5
  WHERE id = $6`

  pool.query(sql, 
    [req.body.Strings,
    parseInt(req.body.Integers),
    parseFloat(req.body.Floats),
    req.body.Dates,
    req.body.Booleans,
    req.params.id], (err) => {
    if (err) {
      return res.send(err)
    }
    res.redirect('/')
  })

})
return router;
}
