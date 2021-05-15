require('app-module-path').addPath(__dirname);    

var createError = require('http-errors');         
var express = require('express');                 
var path = require('path');                       
var cookieParser = require('cookie-parser');      
var logger = require('morgan');                   
var cors = require('cors');

var app = express();    //express 모듈 spring 이랑 비슷함

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//---------- 샘플 
app.use('/module', require('./src/module'));
//---------- 샘플  


app.use('/erp/sys', require('./src/erp/sys'));
app.use('/erp/logi', require('./src/erp/logi'));
app.use('/erp/acc', require('./src/erp/acc'));
app.use('/erp/hr', require('./src/erp/hr'));


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
 
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

 
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
