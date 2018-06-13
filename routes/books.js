var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET all books
router.get('/', function(req, res, next) {

  console.log("NÅ:", req.query.filter);

  // no book ID defined (render /books root)
  if(!req.query.id) {
    console.log('INGEN ID');
    db.books.findAll({order: [["first_published", "DESC"]]}).then(function(books){
      res.render("books", {books: books});
    }).catch(function(error){
        console.error("Error:", error);
        res.send(500, error);
    }); 
  } 
  
  //book ID defined (render /books?id= detail/edit page)
  else { 
    console.log('BOOK ID:' + req.query.id);

    db.books.findOne({
      where: {
        id: req.query.id
      },
      include: [
        {
          model: db.loans,
          as: 'loan',
          include: [
            {
              model: db.patrons,
              as: 'patron'
            }]
        }]
    }).then(function (book) {
      res.render("book_details", {book: book});
  
    }).catch(function(error){
      console.error("Error:", error);
      res.send(500, error);
    });
  }
});

module.exports = router;
