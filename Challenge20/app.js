const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const fs = require('fs')

const bodyParser = require('body-parser')
const req = require('express/lib/request')
const res = require('express/lib/response')
const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('./challenge20.db', sqlite3.OPEN_READWRITE, (err) => {
  if (err) {
    console.log('gagal koneksi', err)
  }
});


app.set('views', path.join(__dirname, 'view'));
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.get('/', (req, res) => {
  db.all("SELECT * FROM Ch20", (err, data) => {
    res.render('list', { list: data })
  })
})

app.get('/add', (req, res) => {
  res.render('add')
})

app.post('/add', (req, res) => {
  db.run('INSERT INTO Ch20 (Strings, Integers, Floats, Dates, Booleans) VALUES (?,?,?,?,?)',
    [[req.body.String],
    [req.body.Integer],
    [req.body.Float],
    [req.body.Date],
    [req.body.Boolean]]
  )
  res.redirect('/')
})

app.get('/delete/:id', (req, res) => {
  var id = req.params.id
  db.run(`DELETE FROM Ch20 WHERE id= ${id}`
  )
  res.redirect('/')
})

app.get('/edit/:id', (req, res) => {
  db.run('SELECT * FROM ch20 WHERE id=?', [req.params.id], (err, data) => 
  res.render('edit', { item: data})
  )
})

// app.post('/edit/:id', (req, res) => {
//   db.run('UPDATE ch20 ')
//   data[req.params.id] = {
//     String: req.body.String, 
//     Integer: req.body.Integer, 
//     Float: req.body.Float, 
//     Date: req.body.Date, 
//     Boolean: req.body.Boolean
//   }
//   fs.writeFileSync('data.json', JSON.stringify(data, null, 3), 'utf-8')
//   res.redirect('/')
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
