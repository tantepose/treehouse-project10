var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// defining routes
var indexRouter = require('./routes/index');
var booksRouter = require('./routes/books');
var booksNewRouter = require('./routes/booksNew');
var patronsRouter = require('./routes/patrons');
var patronsNewRouter = require('./routes/patronsNew');
var loansRouter = require('./routes/loans');
var loansNewRouter = require('./routes/loansNew');
var loansReturnRouter = require('./routes/loansReturn');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routing routes
app.use('/', indexRouter);
app.use('/books', booksRouter);
app.use('/books/new', booksNewRouter);
app.use('/patrons', patronsRouter);
app.use('/patrons/new', patronsNewRouter);
app.use('/loans', loansRouter);
app.use('/loans/new', loansNewRouter);
app.use('/loans/return', loansReturnRouter);

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
