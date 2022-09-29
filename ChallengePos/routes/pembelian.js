var express = require('express');
var router = express.Router();
var pool = require('pg')
var moment = require('moment')

module.exports = function (pool) {



    /* GET home page. */
    router.get('/', async function (req, res) {
        const { json } = req.headers

        try {
            const { invoice, searchdate1, searchdate2 } = req.query

            let search = []
            let count = 1
            let syntax = []
            let sql = 'SELECT * FROM pembelian'
            if (invoice) {
                sql += ' WHERE '
                search.push(`%${invoice}%`)
                syntax.push(`no_invoice ilike '%' || $${count++} || '%'`)
                count++
            }
            if (searchdate1 && searchdate2) {
                if (!sql.includes(' WHERE ')) {
                    sql += ' WHERE'

                }
                search.push(`${searchdate1}`)
                search.push(`${searchdate2}`)
                syntax.push(` tanggal_pembelian >= $${count} AND tanggal_pembelian < $${count + 1}`)
                count++
                count++
            } else if (searchdate1) {
                if (!sql.includes(' WHERE ')) {
                    sql += ' WHERE'

                }
                search.push(`${searchdate1}`)
                syntax.push(` tanggal >= $${count}`)
                count++
            } else if (searchdate2) {
                if (!sql.includes(' WHERE ')) {
                    sql += ' WHERE'

                }
                search.push(`${searchdate2}`)
                syntax.push(` tanggal <= $${count}`)
                count++
            }

            if (syntax.length > 0) {
                sql += syntax.join(' AND ')

            }

            // const noInvoice = req.query.noInvoice ? req.query.noInvoice : rows.length > 0 ? rows[0].no_invoice : '';
            const gudang = await pool.query('SELECT * FROM gudang_barang ORDER BY id_gudang');
            const supplier = await pool.query('SELECT * FROM supplier ORDER BY id_supplier');
            const varian = await pool.query('SELECT * FROM varian ORDER BY barcode');
            const operator = await pool.query('SELECT * FROM pengguna ORDER BY user_id');
            const { rows } = await pool.query(sql, search);
            const noInvoice = req.query.noInvoice ? req.query.noInvoice : '';
     
            const detail = await pool.query('SELECT bd.* FROM detail_pembelian as bd WHERE bd.no_invoice = $1 ORDER BY bd.id_detail', [noInvoice]);
            const array = [rows, detail.rows, gudang.rows, supplier.rows, operator.rows, varian.rows]



            if (json == 'true') {
                res.status(200).json(array)

            } else {
                res.render('pembelian')
            }

        } catch (e) {
            console.log('error', e)
            res.status(500).json({ message: "error get pembelian" })
        }

    });

    router.get('/varian/:barcode', async function (req, res) {
        const { json } = req.headers

        try {
            const barcode = req.params.barcode

            const {rows} = await pool.query('SELECT buy_price FROM varian WHERE barcode = $1', [barcode]);

            if (json == 'true') {
                res.status(200).json(rows)

            } else {
                res.render('pembelian')
            }

        } catch (e) {
            console.log('error', e)
            res.status(500).json({ message: "error get pembelian" })
        }

    });

    router.post('/createinvoice', async function (req, res, next) {
        const {json} = req.headers

        try {

            const { rows } = await pool.query('INSERT INTO pembelian(total_harga) VALUES(0) returning *')
            console.log(rows)
            if(json == 'true') {
                res.status(200).json(rows)
            } else {
                res.render('pembelian')
            }
       
        } catch (e) {
            res.status(500).json({message: 'gagal create invoice'})
        }
    });

    //v
    router.post('/detail', async function (req, res) {
        const {json} = req.headers
        try {
            const {total_harga_detail ,id_supplier, id_gudang, id_operator, no_invoice, barcode, qty, harga_beli} = req.body
            console.log()
            const sqldetail = 'INSERT INTO detail_pembelian(no_invoice, barcode, qty, harga_beli, total_harga)VALUES ($1, $2, $3, $4, $5) returning *'
            const sqld =  await pool.query(sqldetail, [no_invoice, barcode, qty, harga_beli, total_harga_detail])
            if(json == 'true') {
                res.status(200).json(sqld)
            } else {
                res.render('pembelian')
            }
            
        } catch (e) {
            res.status(500).json({message: 'add pembelian detail gagal'})
        }
    });

    router.put('/pbelian/:no_invoice', async function (req, res) {
        const {json} = req.headers
        try {
            const {total_harga ,id_supplier, id_gudang, id_operator, barcode, qty, harga_beli} = req.body
            const no_invoice = req.params.no_invoice
        console.log(id_supplier)
            const sqlpembelian = 'UPDATE pembelian SET total_harga = $1, id_supplier = $2, id_gudang = $3, id_operator = $4 WHERE no_invoice = $5 returning *'
            const sql = await pool.query(sqlpembelian, [total_harga, id_supplier, id_gudang, id_operator, no_invoice])

            if(json == 'true') {
                res.status(200).json(sql)
            } else {
                res.render('pembelian')
            }
            
        } catch (e) {
            res.status(500).json({message: 'put pembelian gagal '})
        }
    });

    router.get('/details/:no_invoice', async function (req, res) {
        const {json} = req.headers
        try {
            const isiDetail = 'SELECT dp.*, v.varian_name FROM detail_pembelian as dp LEFT JOIN varian as v ON dp.barcode = v.barcode WHERE dp.no_invoice = $1 ORDER BY dp.id_detail'
            const { rows } = await pool.query(isiDetail, [req.params.no_invoice]);
            
            if(json == 'true') {
                res.status(200).json(rows)
            } else {
                res.render('pembelian')
            }
        } catch (e) {
            res.status(500).json({message: 'get details dengan noinvoice gagal'})
        }
    });

    router.delete('/:no_invoice', async function (req, res) {
        const { json } = req.headers
        try {
            delPen = await pool.query('DELETE FROM detail_pembelian WHERE no_invoice = $1', [req.params.no_invoice])
            const { rows } = await pool.query('DELETE FROM pembelian WHERE no_invoice = $1', [req.params.no_invoice])
            
            if (json == 'true') {
                 res.status(200).json(rows)
            } else {
                res.render('pembelian')
            }  
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'gagal delete'})
        }
    })

    // router.delete('/diteel/:id_detail', async function (req, res) {
    //     const { json } = req.headers
    //     try {
            
    //         const delDetail = await pool.query('DELETE FROM detail_pembelian WHERE id_detail = $1', [req.params.id_detail])

    //         if (json == 'true') {
    //              res.status(200).json(delDetail)
    //         } else {
    //             res.render('pembelian')
    //         }
    //     } catch (e) {
    //         res.status(500).json({message: 'gagal delete detail'})
    //     }

    // });

    router.delete('/ditel/:id_detail', async function (req, res) {
        const { json } = req.headers
        try {
            
            const delDetail = await pool.query('DELETE FROM detail_pembelian WHERE id_detail = $1', [req.params.id_detail])
            const { rows } = await pool.query('SELECT SUM(total_harga)  AS total FROM detail_pembelian WHERE no_invoice = $1', [req.body.no_invoice])

            const array = [delDetail, rows]

            if (json == 'true') {
                 res.status(200).json(array)
            } else {
                res.render('pembelian')
            }
        } catch (e) {
            res.status(500).json({message: 'gagal delete detail'})
        }

    });


    return router;
}