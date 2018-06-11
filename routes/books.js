var express = require('express');
var router = express.Router();
var Books = require("../models").Books;

/* GET books page. */
router.get('/', function(req, res, next) {
  console.log("GET all books");

  Books.findAll({order: [["first_published", "DESC"]]}).then(function(books){
    console.log("Sucsess, rendering.");
    res.render("books", {books: books});
  }).catch(function(error){
      console.log("Error:", error);
      res.send(500, error);
   });
});

module.exports = router;
