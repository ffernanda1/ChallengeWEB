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

  router.get('/:id', async function (req, res) {
    const { json } = req.headers

    try {
      let id = req.params.id
      let sql = `SELECT var.barcode,
        var.varian_name,
        bar.id_barang,
        bar.nama_barang,
          var.stok,
          var.buy_price,
          var.sell_price,
          var.picture
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

  router.post('/', async function (req, res) {

    const { json } = req.headers


    try {
      let picture;
      let uploadPath;

      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
      // The name of the input field (i.e. "pictures") is used to retrieve the uploaded file
      picture = req.files.gambar;
    
      const filename = `A${Date.now()}-${picture.name}`
      uploadPath = path.join(__dirname, '../public', 'images', filename);

      // Use the mv() method to place the file somewhere on your server

      picture.mv(uploadPath, function (err) {
        const { barcode, nama_varian, stok, buy_price, sell_price, id_barang } = req.body

        const filename1 = `{${filename}}`

        const rows = pool.query(`INSERT INTO varian( barcode, varian_name, stok, picture, sell_price, buy_price, id_barang) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [barcode, nama_varian, stok, filename1, sell_price, buy_price, id_barang])

        if (json == 'true') {
          res.status(200).json(rows)
        } else {
          res.render('varian')
        }

        if (err)
          return res.status(500).send(err);

        if (err) {
          return console.error(err.message);
        }
      })

    } catch (err) {
      res.status(500).json({ message: "gagal add data" })
    }
  })

  router.put('/:id', async function (req, res) {
    const { json } = req.headers

 
    try {
      const { barcodeedit, nama_varianedit, stokedit, buy_priceedit, sell_priceedit, id_barangedit } = req.body

      let picture;
      let uploadPath;


      if (!req.files || Object.keys(req.files).length === 0) {
        const edit = pool.query(`UPDATE varian set 
                varian_name = $1,
                stok = $2,
                  sell_price = $3,
                   buy_price = $4,
                  id_barang = $5
              WHERE barcode = $6`, [nama_varianedit, stokedit, buy_priceedit, sell_priceedit, id_barangedit, barcodeedit])

        if (json == 'true') {
          res.status(200).json(edit)
        } else {
          res.render('varian')
        }

      } else {
        // The name of the input field (i.e. "pictures") is used to retrieve the uploaded file
        picture = req.files.gambaredit;
        const filename = `A${Date.now()}-${picture.name}`
        uploadPath = path.join(__dirname, '../public', 'images', filename);
        // Use the mv() method to place the file somewhere on your server
        picture.mv(uploadPath, function (err) {
          const { barcodeedit, nama_varianedit, stokedit, buy_priceedit, sell_priceedit, id_barangedit } = req.body
          const filename1 = `{${filename}}`
          console.log('fileupload', req.body)
          const editfile = pool.query(`UPDATE varian set 
                varian_name = $1,
                stok = $2,
                 picture = $3,
                  sell_price = $4,
                   buy_price = $5,
                  id_barang = $6
              WHERE barcode = $7`, [nama_varianedit, stokedit, filename1, buy_priceedit, sell_priceedit, id_barangedit, barcodeedit])

          if (json == 'true') {
            res.status(200).json(editfile)
          } else {
            res.render('varian')
          }
        })
      }
    } catch (error) {
      res.status(500).json({message: 'upload gagal'})
    }

  })
  router.delete('/:barcode', async function (req, res) {
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