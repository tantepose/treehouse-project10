var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET /books/new
// render empty new book page
router.get('/', function(req, res, next) {
  res.render("books_new", {book: db.books.build()});
});

// POST /books/new
// create a new book in database using data from request body
router.post('/', function(req, res, next) {
  db.books.create(req.body).then(function(book) {
    res.redirect('../books');
  // input doesn't match the database model
  // render page with error messages, populate inputs from request body
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError"){
      res.render("books_new", {
        book: db.books.build(req.body),
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(error) {
    res.sendStatus(500, error);
  }); 
}); 

module.exports = router;
