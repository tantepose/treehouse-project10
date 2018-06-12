var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

/* GET books page. */
router.get('/', function(req, res, next) {
  console.info("GET all books");

  db.books.findAll({order: [["first_published", "DESC"]]}).then(function(books){
    console.info("Sucsess, rendering.");
    res.render("books", {books: books});
  }).catch(function(error){
      console.error("Error:", error);
      res.send(500, error);
   });
});

module.exports = router;
