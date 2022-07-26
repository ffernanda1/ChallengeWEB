var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', (req, res) => {
  const url = req.url == '/' ? '/?page=1' : req.url
  const page = parseInt(req.query.page) || 1
  const limit = 3
  const offset = (page - 1) * limit
  const search = []
  const hasil = []



  //Searching
  if (req.query.String) {
    search.push(`Strings like '%' || ? || '%'`)
    hasil.push(req.query.String)
  }

  if (req.query.Integer) {
    search.push(`Integers = ?`)
    hasil.push(req.query.Integer)
  }

  if (req.query.Float) {
    search.push(`Floats = ?`)
    hasil.push(req.query.Float)
  }

  if (req.query.Date && req.query.Date2) {
    search.push(`Dates BETWEEN ? AND ?`)
    hasil.push(req.query.Date, req.query.Date2)
  } else if (req.query.Date) {
    search.push(`Dates > ?`)
    hasil.push(req.query.Date)
  } else if (req.query.Date2) {
    search.push(`Dates < ?`)
    hasil.push(req.query.Date2)
  }

  if(req.query.Boolean) {
    search.push(`Booleans = ?`)
    hasil.push(req.query.Boolean)
  }

  //format command Searching
  let sql = 'SELECT COUNT(*) AS total FROM Ch20';
  if (search.length > 0) {
    sql += ` WHERE ${search.join(' and ')}`
  }

  db.all(sql, hasil, (err, data) => {
    const pages = Math.ceil(data[0].total / limit)

    sql = 'SELECT * FROM Ch20'
    if (search.length > 0) {
      sql += ` WHERE  ${search.join(' and  ')}`
    }

    sql += ' LIMIT ? OFFSET ?'
    db.all(sql, [...hasil, limit, offset], (err, data) => {
      res.render('list', { list: data, pages, page, offset, moment, url, query: req.query })
    })
  })
})

router.get('/add', (req, res) => {
  res.render('add')
})

router.post('/add', (req, res) => {
  db.run('INSERT INTO Ch20 (Strings, Integers, Floats, Dates, Booleans) VALUES (?,?,?,?,?)',
    [[req.body.String],
    [req.body.Integer],
    [req.body.Float],
    [req.body.Date],
    [req.body.Boolean]]
  )
  res.redirect('/')
})

router.get('/delete/:id', (req, res) => {
  let id = req.params.id
  db.run(`DELETE FROM Ch20 WHERE id= ${id}`
  )
  res.redirect('/')
})

router.get('/update/:id', (req, res) => {
  let id = req.params.id
  let sql = `SELECT * FROM Ch20 WHERE id=${id}`;

  db.all(sql, (err, data) => {
    if (err) {
      console.log(err)
    } else {
      res.render('edit', { item: data[0] })
    }
  })
})

router.post('/update/:id', (req, res) => {
  let sql = `UPDATE Ch20 SET 
  Strings = '${req.body.Strings}',
  Integers = ${req.body.Integers},
  Floats = ${req.body.Floats},
  Dates = '${req.body.Dates}',
  Booleans = '${req.body.Booleans}'
  WHERE id = ${req.params.id}
  `
  db.run(sql, (err) => {
    if (err) {
      return res.send(err)
    }
    res.redirect('/')
  })

})
module.exports = router;
