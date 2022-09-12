var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function (pool) {



  /* GET home page. */
  router.get('/', async function (req, res) {
    try {
      let sql = 'SELECT * FROM satuan'
      const get = await pool.query(sql)
      res.status(200).json(get.rows)
    } catch (error) {
      console.log(error)
      res.status(500).json({message: "error tampilkan data"})
    }
  })

  router.post('/', async function (req, res) {
    try {
      let sql = `INSERT INTO satuan (id_satuan, nama_satuan, keterangan) VALUES ($1,$2,$3)`
      const post = await pool.query(sql, [req.body.id_satuan, req.body.nama_satuan, req.body.keterangan])
      res.status(200).json(post)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error add satuan" })
    }
  });

  router.get('/:id_satuan', async function (req, res) {
    try {
      let id = req.params.id_satuan
      let sql = 'SELECT * FROM satuan WHERE id_satuan= $1'
      const editGet = await pool.query(sql, [id])
      res.status(200).json(editGet)
    } catch (error) {
      res.status(500).json({message: 'tidak mendapatkan data'})
    }
  })

  router.put('/:id_satuan', async function (req, res) {
    try {
      let sql = `UPDATE satuan SET 
      nama_satuan = $1,
      keterangan = $2
      WHERE id_satuan = $3`

      const edit = await pool.query(sql,
        [req.body.nama_satuan,
          req.body.keterangan,
        req.params.id_satuan]);

      res.status(200).json(edit)
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "error edit satuan" })
    }
  })

  router.delete('/:id_satuan', async function (req, res) {
    try {
      let id = req.params.id_satuan
      let sql = `DELETE FROM satuan WHERE id_satuan= $1`;

      const hapus = await pool.query(sql, [id])
      res.status(200).json(hapus)
    } catch (error) {
      res.status(500).json({ message: "error hapus satuan"})
    }

  })

  return router;
}
