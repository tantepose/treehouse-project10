var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET new book page
router.get('/', function(req, res, next) {
  res.render("books_new", {book: db.books.build()});
});

// POST new book, saving to database
router.post('/', function(req, res, next) {
  console.log('lager ny bok');
  db.books.create(req.body).then(function(book) {
    console.log('bok laget, router til:', book.id, book.title);
    res.redirect('../books');
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError"){
      res.render("books_new", {
        book: db.books.build(req.body),
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err) {
    res.send(500);
  }); 
}); 
//mer error handling? se blogg-greia som du lagde med treehouse

module.exports = router;
