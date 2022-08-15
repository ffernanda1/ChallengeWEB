var express = require('express');
var router = express.Router();
const mongodb = require('mongodb')

module.exports = function (db) {

  const collection = db.collection('challenge22');

  router.get('/', async function (req, res, next) {
    const limit = req.query.display
    const page = req.query.page || 1

    const offset = limit == 'all' ? 0 : (page - 1) * limit
    const searchParams1 = {}
    const searchParams2 = []



    //searching

    if (req.query.strings) {
      const regexName = new RegExp(`${req.query.strings}`, `i`);
      searchParams1['strings'] = regexName
    }

    if (req.query.integers) {
      const regexName = new RegExp(req.query.integers);
      searchParams1['integers'] = regexName
    }

    if (req.query.floats) {
      const regexName = new RegExp(req.query.floats);
      searchParams1['floats'] = regexName
    }

    if (req.query.dates1 && req.query.dates2) {
      const regexName = [{$gte: req.query.dates1, $lt: req.query.dates2}]
      searchParams1['dates'] = regexName.reduce(function(result, item) {
        var key = Object.keys(item)[0]; //first property: a, b, c
        result[key] = item[key];
        return result;
      }, {});
    } else if(req.query.dates1) {
      const regexName = [{$gte: req.query.dates1}]
      searchParams1['dates'] = regexName.reduce(function(result, item) {
        var key = Object.keys(item)[0]; //first property: a, b, c
        result[key] = item[key];
        return result;
      }, {});
    } else if(req.query.dates2) {
      const regexName = [{$lt: req.query.dates2}]
      searchParams1['dates'] = regexName.reduce(function(result, item) {
        var key = Object.keys(item)[0]; //first property: a, b, c
        result[key] = item[key];
        return result;
      }, {});
    }

    if (req.query.dates2) {
      const regexName = new Date(req.query.dates2);

    }

    if (req.query.booleans) {
      searchParams1['booleans'] = JSON.parse(req.query.booleans)
    }

    // if(searchParams2.length > 0) {
    // let searchParams1 = Object.assign(searchParams1, searchParams2)
    // console.log('object gabung', searchParams1)
    // }


    try {
      const collection = db.collection('challenge22');

      const totalData = await collection.find(searchParams1).count()
      const totalPages = limit == 'all' ? 1 : Math.ceil(totalData / limit)
      const limitation = limit == 'all' ? {} : { limit: parseInt(limit), skip: offset }
      const isidata = await collection.find(searchParams1, limitation).toArray();
      console.log('test', searchParams1)
      res.status(200).json({
        data: isidata,
        totalData,
        totalPages,
        display: limit,
        page: parseInt(page)
      })

    } catch (e) {
      res.status(500).json({ message: "error pengambilan data" })
    }
  });

  router.get('/:id', async function (req, res, next) {
    try {
      const collection = db.collection('challenge22');
      const isidata = await collection.findOne({ _id: mongodb.ObjectId(req.params.id) })
      res.status(200).json(isidata)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error cari data" })
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const collection = db.collection('challenge22');
      const returnDocument = await collection.insertOne({
        strings: req.body.strings,
        integers: req.body.integers,
        floats: parseFloat(req.body.floats),
        dates: req.body.dates,
        booleans: JSON.parse(req.body.booleans)
      });
      const user = await collection.findOne({ _id: returnDocument.insertedId })
      res.status(200).json(user)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error tambah data" })
    }
  });

  router.put('/:id', async function (req, res, next) {
    try {
      const collection = db.collection('challenge22');
      await collection.updateOne({
        _id: mongodb.ObjectId(req.params.id)
      }, {
        $set: {
          strings: req.body.strings,
          integers: req.body.integers,
          floats: parseFloat(req.body.floats),
          dates: req.body.dates,
          booleans: JSON.parse(req.body.booleans)
        }
      });
      const isidata = await collection.findOne({ _id: mongodb.ObjectId(req.params.id) })
      res.status(200).json(isidata)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error update data" })
    }
  });

  router.delete('/:id', async function (req, res, next) {
    try {
      const collection = db.collection('challenge22');
      const isidata = await collection.findOne({ _id: mongodb.ObjectId(req.params.id) })
      const hapus = await collection.deleteOne({
        _id: mongodb.ObjectId(req.params.id)
      });
      res.status(200).json(hapus)
    } catch (err) {
      console.log("ini error nya", err)
      res.status(500).json({ message: "error delete data" })
    }
  });

  return router;
}