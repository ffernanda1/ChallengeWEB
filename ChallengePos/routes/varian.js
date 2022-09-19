var express = require('express');
var router = express.Router();
var pool = require('pg');
var path = require('path')
var moment = require('moment');


module.exports = function (pool) {

  router.get('/', async function (req, res) {
    const { json } = req.headers

    try {
      let sql = `SELECT var.barcode,
        var.varian_name,
        bar.id_barang,
        bar.nama_barang,
          var.stok,
          var.buy_price,
          var.sell_price,
          var.picture
    FROM varian var
    INNER JOIN barang bar ON bar.id_barang = var.id_barang`


      const data = await pool.query(sql)
      if (json == 'true') {
        res.status(200).json(data.rows)
      } else {
        res.render('varian')
      }



    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error tampilkan varian" })
    }
  })


  router.get('/select', async function (req, res) {
    const { json } = req.headers

    try {
      let sql = `SELECT id_barang, nama_barang FROM barang`
      const { rows } = await pool.query(sql)
      if (json == 'true') {
        res.status(200).json(rows)
      } else {
        res.render('varian')
      }

    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error tampilkan varian" })
    }
  })


  router.get('/api/:id', async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id
      let sql = `SELECT var.barcode,
        var.varian_name,
        bar.id_barang,
        bar.nama_barang,
          var.stock,
          var.buy_price,
          var.sell_price,
          var.pictures
FROM varian var
INNER JOIN barang bar ON bar.id_barang = var.id_barang WHERE var.id_barang = $1`
      const { rows } = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(rows)
      } else {
        res.render('varian')
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'ini eror' })
    }

  });

  router.get('/info/:id', async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id
      let sql = `SELECT var.barcode,
        var.varian_name,
        bar.id_barang,
        bar.nama_barang,
          var.stock,
          var.buy_price,
          var.sell_price,
          var.pictures
FROM varian var
INNER JOIN barang bar ON bar.id_barang = var.id_barang WHERE barcode = $1;`
      const { rows } = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(rows)
      } else {
        res.render('varian')
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'ini eror' })
    }

  });

  router.post('/', function (req, res) {
    const { json } = req.headers

    try {
      let picture;
      let uploadPath;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      // The name of the input field (i.e. "pictures") is used to retrieve the uploaded file
      picture = req.files.picture;
      console.log(picture.name)
      const filename = `A${Date.now()}-${picture.name}`
      uploadPath = path.join(__dirname, '../public', 'images', filename);
      console.log(uploadPath)
      // Use the mv() method to place the file somewhere on your server
      pictures.mv(uploadPath, function (err) {
        if (err)
          return res.status(500).send(err);
        const { barcode, nama, stok, harga_jual, harga_beli, id_barang } = req.body
        console.log(barcode, nama, stok, harga_jual, harga_beli, id_barang)

        const { rows } = pool.query(`INSERT INTO varian(barcode, varian_name,
                     stok, picture, sell_price,
                      buy_price, id_barang) 
     VALUES ($1, $2, $3, $4, $5, $6, $7)`, [barcode, nama, stok, filename, harga_jual, harga_beli, id_barang])
        if (err) {
          return console.error(err.message);
        }
        if (json == 'true') {
          res.status(200).json(rows)
        } else {
          res.render(500).json({ message: 'syntax add error' })
        }
      }
      )
    } catch (err) {
      res.status(500).json({ message: "gagal add data" })
    }
  })

  router.get('/edit/:id', async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id
      let sql = `SELECT var.barcode,
                    var.varian_name,
                    bar.id_barang,
                    bar.nama_barang,
                      var.stock,
                      var.buy_price,
                      var.sell_price,
                      var.pictures
FROM varian var
INNER JOIN barang bar ON bar.id_barang = var.id_barang WHERE barcode = $1;`
      const { rows } = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(rows)
      } else {
        res.render('varian_edit')
      }
    } catch (e) {
      console.log(e)
      res.status(500).json({ message: 'ini eror' })
    }

  });


  router.post('/edit/:id', async function (req, res) {
    const { json } = req.headers

    const { custom_input, nama, stok, saved_pictures, harga_jual, harga_beli, barang } = req.body
    let pictures;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
      db.query(`UPDATE varian set 
                varian_name = $1,
                stock = $2,
                 pictures = $3,
                  sell_price = $4,
                   buy_price = $5,
                  id_barang = $6,
              WHERE barcode = $7`, [nama, stok, saved_pictures, harga_jual, harga_beli, barang, custom_input], (err) => {
        if (err) {
          return console.error(err.message);
        }
        res.redirect('/varian')
      })
    } else {
      // The name of the input field (i.e. "pictures") is used to retrieve the uploaded file
      pictures = req.files.pictures;
      const filename = `A${Date.now()}-${pictures.name}`
      uploadPath = path.join(__dirname, '/../public', 'pictures', filename);
      // Use the mv() method to place the file somewhere on your server
      pictures.mv(uploadPath, function (err) {
        if (err)
          return res.status(500).send(err);
        //  const {custom_input, nama, barang, stok, harga, satuan, gudang } = req.body

        db.query(`UPDATE varian set 
                varian_name = $1,
                stock = $2,
                 pictures = $3,
                  sell_price = $4,
                   buy_price = $5,
                  id_barang = $6,
              WHERE barcode = $7`, [nama, stok, saved_pictures, harga_jual, harga_beli, barang, custom_input], (err) => {
          if (err) {
            return console.error(err.message);
          }
          res.redirect('/varian')
        })
      })
    }
  })
  router.get('/delete/:barcode', async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.barcode
      let sql = `DELETE FROM varian WHERE barcode = $1`;

      const hapus = await pool.query(sql, [id])
      if (json == 'true') {
        res.status(200).json(hapus)
      } else {
        res.render('varian')
      }
    } catch (error) {
      res.status(500)
    }

  });

  return router;
}