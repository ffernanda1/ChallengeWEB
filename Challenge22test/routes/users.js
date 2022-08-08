var express = require('express');
var router = express.Router();
const mongodb = require('mongodb')

module.exports = function (db) {

  const collection = db.collection('challenge');

  router.get('/', async function (req, res, next) {
    const limit = req.query.display
    const page = req.query.page || 1

    const offset = limit == 'all' ? 0 : (page - 1) * limit
    const searchParams = {}

    //searching

    if (req.query.strings) {
      const regexName = new RegExp(`${req.query.strings}`, `i`);
      searchParams['strings'] = regexName
    }

    if (req.query.integers) {
      const regexName = new RegExp(req.query.integers, `i`);
      searchParams['integers'] = regexName
    }

    if (req.query.floats) {
      const regexName = new RegExp(req.query.floats, `i`);
      searchParams['integers'] = regexName
    }


    try {
      const collection = db.collection('challenge');

      const totalData = await collection.find(searchParams).count()
      const totalPages = limit == 'all' ? 1 : Math.ceil(totalData / limit)
      const limitation = limit == 'all' ? {} : { limit: parseInt(limit), skip: offset }
      const isidata = await collection.find(searchParams, limitation).toArray();
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
      const collection = db.collection('challenge');
      const isidata = await collection.findOne({ _id: mongodb.ObjectId(req.params.id) })
      res.status(200).json(isidata)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error cari data" })
    }
  });

  router.post('/', async function (req, res, next) {
    try {
      const collection = db.collection('challenge');
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
      const collection = db.collection('challenge');
      await collection.updateOne({
        _id: mongodb.ObjectId(req.params.id)
      }, {
        $set: {
          strings: req.body.strings,
          integers: req.body.integers,
          floats: parseFloat(req.body.floats),
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
      const collection = db.collection('challenge');
      const isidata = await collection.findOne({ _id: mongodb.ObjectId(req.params.id) })
      await collection.deleteMany({
        _id: mongodb.ObjectId(req.params.id)
      });
      res.status(200).json(isidata)
    } catch (err) {
      console.log(err)
      res.status(500).json({ message: "error delete data" })
    }
  });

  return router;
}