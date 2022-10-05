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
            const { searchinvoice, searchdates1, searchdates2 } = req.query

            let search = []
            let count = 1
            let syntax = []
            let sql = 'SELECT * FROM penjualan'
            if (searchinvoice) {
                sql += ' WHERE '
                search.push(`%${searchinvoice}%`)
                syntax.push(`no_invoice ilike '%' || $${count++} || '%'`)
                count++
            }
            if (searchdates1 && searchdates2) {
                if (!sql.includes(' WHERE ')) {
                    sql += ' WHERE'

                }
                search.push(`${searchdates1}`, `${searchdates2}`)
                syntax.push(` tanggal BETWEEN $${count} AND $${count + 1}`)
                count++
                count++
            } else if (searchdates1) {
                if (!sql.includes(' WHERE ')) {
                    sql += ' WHERE'
                }
                search.push(`${searchdates1}`)
                syntax.push(` tanggal >= $${count}`)
                count++

            } else if (searchdates2) {
                if (!sql.includes(' WHERE ')) {
                    sql += ' WHERE'
                }
                search.push(`${searchdates2}`)
                syntax.push(` tanggal <= $${count}`)
                count++

            }

            if (syntax.length > 0) {
                sql += syntax.join(' AND ')

            }

            // const noInvoice = req.query.noInvoice ? req.query.noInvoice : rows.length > 0 ? rows[0].no_invoice : '';
            const varian = await pool.query('SELECT * FROM varian ORDER BY barcode');
            const operator = await pool.query('SELECT * FROM pengguna ORDER BY user_id');
            const { rows } = await pool.query(sql, search);
           
            const noInvoice = req.query.noInvoice ? req.query.noInvoice : '';
     
            const detail = await pool.query('SELECT bd.* FROM detail_penjualan as bd WHERE bd.no_invoice = $1 ORDER BY bd.id_detail', [noInvoice]);
            const array = [rows, detail.rows, varian.rows]

            if (json == 'true') {
                res.status(200).json(array)

            } else {
                res.render('penjualan', {user: req.session.user})
            }

        } catch (e) {
            console.log('error', e)
            res.status(500).json({ message: "error get penjualan" })
        }

    });

    router.get('/varian/:barcode',isLoggedIn, async function (req, res) {
        const { json } = req.headers

        try {
            const barcode = req.params.barcode
            const {rows} = await pool.query('SELECT sell_price FROM varian WHERE barcode = $1', [barcode]);

            if (json == 'true') {
                res.status(200).json(rows)

            } else {
                res.render('penjualan')
            }

        } catch (e) {
            console.log('error', e)
            res.status(500).json({ message: "error get penjualan" })
        }

    });

    router.post('/createinvoice',isLoggedIn, async function (req, res, next) {
        const {json} = req.headers

        try {

            const { rows } = await pool.query('INSERT INTO penjualan(total_harga) VALUES(0) returning *')
            console.log(rows)
            if(json == 'true') {
                res.status(200).json(rows)
            } else {
                res.render('penjualan')
            }
       
        } catch (e) {
            res.status(500).json({message: 'gagal create invoice'})
        }
    });

    //v
    router.post('/detail',isLoggedIn, async function (req, res) {
        const {json} = req.headers
        try {
            const {total_harga_detail ,id_supplier, id_gudang, id_operator, no_invoice, barcode, qty, harga_jual} = req.body
            console.log(total_harga_detail, no_invoice, barcode, qty, harga_jual)
            const sqldetail = 'INSERT INTO detail_penjualan(no_invoice, barcode, qty, harga_jual, total_harga)VALUES ($1, $2, $3, $4, $5) returning *'
            const sqld =  await pool.query(sqldetail, [no_invoice, barcode, qty, harga_jual, total_harga_detail])
            if(json == 'true') {
                res.status(200).json(sqld)
            } else {
                res.render('penjualan')
            }
            
        } catch (e) {
            res.status(500).json({message: 'add penjualan detail gagal'})
        }
    });

    router.put('/pjualan/:no_invoice',isLoggedIn, async function (req, res) {
        const {json} = req.headers
        try {
            const {total_harga, total_bayar, kembalian} = req.body
            const no_invoice = req.params.no_invoice
            
            const sqlpenjualan = 'UPDATE penjualan SET total_harga = $1, total_bayar = $2, kembalian = $3 WHERE no_invoice = $4 returning *'
            const sql = await pool.query(sqlpenjualan, [total_harga, total_bayar, kembalian, no_invoice])

            if(json == 'true') {
                res.status(200).json(sql)
            } else {
                res.render('penjualan')
            }
            
        } catch (e) {
            res.status(500).json({message: 'put penjualan gagal '})
        }
    });

    router.get('/details/:no_invoice',isLoggedIn, async function (req, res) {
        const {json} = req.headers
        try {
            const isiDetail = 'SELECT dp.*, v.varian_name FROM detail_penjualan as dp LEFT JOIN varian as v ON dp.barcode = v.barcode WHERE dp.no_invoice = $1 ORDER BY dp.id_detail'
            const { rows } = await pool.query(isiDetail, [req.params.no_invoice]);
            
            if(json == 'true') {
                res.status(200).json(rows)
            } else {
                res.render('penjualan')
            }
        } catch (e) {
            res.status(500).json({message: 'get details dengan noinvoice gagal'})
        }
    });

    router.delete('/:no_invoice',isLoggedIn, async function (req, res) {
        const { json } = req.headers
        try {
            const delPen = await pool.query('DELETE FROM detail_penjualan WHERE no_invoice = $1', [req.params.no_invoice])
            const { rows } = await pool.query('DELETE FROM penjualan WHERE no_invoice = $1', [req.params.no_invoice])
            
            if (json == 'true') {
                 res.status(200).json(rows)
            } else {
                res.render('penjualan')
            }  
        } catch (e) {
            console.log(e)
            res.status(500).json({message: 'gagal delete'})
        }
    })

    router.delete('/ditel/:id_detail',isLoggedIn, async function (req, res) {
        const { json } = req.headers
        try {
            
            const delDetail = await pool.query('DELETE FROM detail_penjualan WHERE id_detail = $1', [req.params.id_detail])
            const { rows } = await pool.query('SELECT SUM(total_harga)  AS total FROM detail_penjualan WHERE no_invoice = $1', [req.body.no_invoice])

            const array = [delDetail, rows]

            if (json == 'true') {
                 res.status(200).json(array)
            } else {
                res.render('penjualan')
            }
        } catch (e) {
            res.status(500).json({message: 'gagal delete detail'})
        }

    });


    return router;
}