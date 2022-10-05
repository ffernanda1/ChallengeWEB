var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')
const { isLoggedIn } = require('../helpers/util');

module.exports = function (pool) {



  /* GET home page. */
  router.get('/',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let sql = 'SELECT * FROM supplier'
      const get = await pool.query(sql)
      if (json == 'true') {
        res.status(200).json(get.rows)
      } else {
        res.render('supplier', {user: req.session.user})
      }
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error tampilkan data" })
    }
  })

  router.post('/', async function (req, res) {
    const { json } = req.headers

    try {
      let sql = `INSERT INTO supplier ( nama, alamat, telp) VALUES ($1,$2,$3)`
      const post = await pool.query(sql, [req.body.nama_supplier, req.body.alamat_supplier, req.body.nomor_hp])
      if (json == 'true') {
        res.status(200).json(post)
      } else {
        res.render('supplier')
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error add supplier" })
    }
  });

  router.get('/:id_supplier',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id_supplier
      let sql = 'SELECT * FROM supplier WHERE id_supplier= $1'
      const editGet = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(editGet.rows)
      } else {
        res.render('supplier')
      }

    } catch (error) {
      res.status(500).json({ message: 'tidak mendapatkan data' })
    }
  })

  router.put('/:id_supplier',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let sql = `UPDATE supplier SET 
      nama = $1,
      alamat = $2,
      telp = $3
      WHERE id_supplier = $4`

      const edit = await pool.query(sql,
        [req.body.nama_supplier,
        req.body.alamat_supplier,
        req.body.nomor_hp,
        req.params.id_supplier
        ]);

      if (json == 'true') {
        res.status(200).json(edit)
      } else {
        res.render('supplier')
      }


    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error edit supplier" })
    }
  })

  router.delete('/:id_supplier',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id_supplier
      let sql = `DELETE FROM supplier WHERE id_supplier= $1`;

      const hapus = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(hapus)
      } else {
        res.render('supplier')
      }

    } catch (error) {
      res.status(500)
    }

  })

  return router;
}
