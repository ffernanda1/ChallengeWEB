var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressLayouts = require('express-ejs-layouts')
var fileupload = require("express-fileupload")

const {Pool} = require('pg')
const pool = new Pool({
  user: 'nanda',
  host: 'localhost',
  database: 'pos',
  password: '1234',
  port: '5432'
})

// async function main(){

//   try{
//     await pool.connect();
//     console.log('Connected success');
//     c
//   }
// }

var indexRouter = require('./routes/index')(pool);
// var usersRouter = require('./routes/users')(pool);
var barangRouter = require('./routes/barang')(pool);
var satuanRouter = require('./routes/satuan')(pool);
var supplierRouter = require('./routes/supplier')(pool);
var varianRouter = require('./routes/varian')(pool);
var gudangRouter = require('./routes/gudang_barang')(pool);;
var pembelianRouter = require('./routes/pembelian')(pool);
var penjualanRouter = require('./routes/penjualan')(pool);
// var penjualandetailRouter = require('./routes/penjualan_detail')(pool);

var app = express();

//Public engine setup
 app.use('/public', express.static('public'));

// view engine setup
// app.use(expressLayouts)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileupload())
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/barang', barangRouter);
app.use('/satuan', satuanRouter);
app.use('/supplier', supplierRouter);
app.use('/varian', varianRouter);
app.use('/gudang', gudangRouter);
app.use('/pembelian', pembelianRouter);
app.use('/penjualan', penjualanRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
