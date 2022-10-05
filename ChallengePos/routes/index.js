var express = require('express');
var router = express.Router();
const { isLoggedIn } = require('../helpers/util');
const bcrypt = require('bcrypt');
const saltRounds = 10;



/* GET home page. */
module.exports = function (pool) {
  router.get('/', function (req, res, next) {
    res.render('login', {
      info: req.flash('info')
    })
  });

  router.post('/', async function (req, res) {
    try {
      const { email, password } = req.body
      await pool.query('SELECT * FROM pengguna WHERE email = $1', [email], (err, data) => {
        if (err) {
          console.log(err)
          return res.send(err)
        }
        if (data.rows.length == 0) {
          req.flash('info', 'email not found')
          return res.redirect('/')
        }
        bcrypt.compare(password, data.rows[0].password, function (err, result) {
          if (err) {
            console.log(err)
            return res.send(err)
          }
          if (!result) {
            req.flash('info', 'incorrect password')
            return res.redirect('/')
          }
          req.session.user = data.rows[0]
          res.redirect('/utama')
        })
      })
    } catch (err) {
      console.log(err)
      req.flash('info', err)
    }
  })

  router.get('/register', function (req, res) {
    res.render('register', { info: req.flash('info') })
  })

  router.post('/register', async (req, res) => {
    try {
      const { email, name, password, repassword, role } = req.body

      console.log(email, name, password, repassword, role)

      if (password != repassword) {
        throw 'password tidak sama'
      }
      const { rows } = await pool.query('SELECT * FROM pengguna WHERE email = $1', [email])

      if (rows.length > 0) {
        throw 'email sudah terdaftar coba lagi'
      }

      const hash = bcrypt.hashSync(password, saltRounds);
      const createUser = await pool.query('INSERT INTO pengguna(email, name, password, role) VALUES($1, $2, $3, $4)', [email, name, hash, role])
      req.flash('info', 'selamat, akun anda telah dibuat Silahkan Login!')
      res.redirect('/')
    } catch (err) {
      req.flash('info', err)
      res.redirect('/register')
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy(function (err) {
      res.redirect('/')
    })
  })

  router.get('/utama', isLoggedIn, function (req, res) {
    console.log(req.session)
    res.render("utama", {user: req.session.user})
  })



  return router;
}