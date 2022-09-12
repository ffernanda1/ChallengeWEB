var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function (pool) {



  /* GET home page. */
  router.get('/', async function (req, res) {
    try {
      let sql = 'SELECT * FROM gudang_barang'
      const get = await pool.query(sql)
      res.status(200).json(get.rows)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error tampilkan data" })
    }
  })

  router.post('/', async function (req, res) {
    try {
      let sql = `INSERT INTO gudang_barang (id_gudang, nama_gudang, alamat_gudang) VALUES ($1,$2,$3)`
      const post = await pool.query(sql, [req.body.id_gudang, req.body.nama_gudang, req.body.alamat_gudang])
      res.status(200).json(post)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error add gudang" })
    }
  });

  router.get('/:id_gudang', async function (req, res) {
    try {
      let id = req.params.id_gudang
      let sql = 'SELECT * FROM gudang_barang WHERE id_gudang= $1'
      const editGet = await pool.query(sql, [id])
      res.status(200).json(editGet)
    } catch (error) {
      res.status(500).json({ message: 'tidak mendapatkan data' })
    }
  })

  router.put('/:id_gudang', async function (req, res) {
    try {
      let sql = `UPDATE gudang_barang SET 
      nama_gudang = $1,
      alamat_gudang = $2
      WHERE id_gudang = $3`

      const edit = await pool.query(sql,
        [req.body.nama_gudang,
        req.body.alamat_gudang,
        req.params.id_gudang
        ]);

      res.status(200).json(edit)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error edit gudang" })
    }
  })

  router.delete('/:id_gudang', async function (req, res) {
    try {
      let id = req.params.id_gudang
      let sql = `DELETE FROM gudang_barang WHERE id_gudang= $1`;

      const hapus = await pool.query(sql, [id])
      res.status(200).json(hapus)
    } catch (error) {
      res.status(500)
    }

  })

  return router;
}
