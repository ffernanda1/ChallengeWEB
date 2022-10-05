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
      let sql = 'SELECT * FROM satuan'
      const get = await pool.query(sql)
      if (json == "true") {
        res.status(200).json(get.rows)
      } else {
        res.render('satuan', {user: req.session.user})
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error tampilkan data" })
    }
  })

  router.post('/',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let sql = `INSERT INTO satuan (id_satuan, nama_satuan, keterangan) VALUES ($1,$2,$3)`
      const post = await pool.query(sql, [req.body.id_satuan, req.body.nama_satuan, req.body.keterangan])
      if (json == 'true') {
        res.status(200).json(post)
      } else {
        res.render('satuan')
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error add satuan" })
    }
  });

  router.get('/:id_satuan',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id_satuan
      let sql = 'SELECT * FROM satuan WHERE id_satuan= $1'
      const editGet = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(editGet.rows)
      } else {
        res.render('satuan')
      }

    } catch (error) {
      res.status(500).json({ message: 'tidak mendapatkan data' })
    }
  })

  router.put('/:id_satuan',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let sql = `UPDATE satuan SET 
      nama_satuan = $1,
      keterangan = $2
      WHERE id_satuan = $3`

      const edit = await pool.query(sql,
        [req.body.nama_satuan,
        req.body.keterangan,
        req.params.id_satuan]);

      if (json == 'true') {
        res.status(200).json(edit)
      } else {
        res.render('satuan')
      }

    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error edit satuan" })
    }
  })

  router.delete('/:id_satuan',isLoggedIn, async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id_satuan
      let sql = `DELETE FROM satuan WHERE id_satuan= $1`;
      const hapus = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(hapus)
      } else {
        res.render('satuan')
      }

    } catch (error) {
      res.status(500)
    }

  })

  return router;
}
