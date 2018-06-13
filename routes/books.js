var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET all books
router.get('/', function(req, res, next) {
  db.books.findAll({order: [["first_published", "DESC"]]}).then(function(books){
    res.render("books", {books: books});
  }).catch(function(error){
      console.error("Error:", error);
      res.send(500, error);
   });
});

module.exports = router;
