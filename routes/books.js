var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET /books(?filter/id=) routes
// check query string parameter and do the right query
router.get('/', function(req, res, next) {

  // the /books root, no id or filter
  // get all books, ordered by title
  if(!req.query.id && !req.query.filter) {
    db.books.findAll({order: [["title", "ASC"]]}).then(function(books){
      res.render("books", {books: books});
    }).catch(function(error){
        res.send(500, error);
    }); 
  } 
  
  // the /books?id= route
  // get the details/edit page for the requested book.id
  else if (req.query.id) { 
    db.loans.findAll({
      where: {
        book_id: req.query.id
      },
      include: [
        {
          model: db.books,
          as: 'book'
        },
        {
          model: db.patrons,
          as: 'patron'
        }   
      ]
    }).then(function (loan) {
      res.render("book_details", {loan: loan});
    }).catch(function(error){
      console.log(error);
      res.send(500, error);
    });
  }

  // the /books?id= route
  // get the details/edit page for the requested book.id
  else if (req.query.filter == 'overdue') {

  }

  // the /books?id= route
  // get the details/edit page for the requested book.id
  else if (req.query.filter == 'checked_out') {

  }
});

// POST edited book
// get the book by it's ID, then update with input from the request body
router.post('/', function(req, res, next){
  db.books.findById(req.query.id).then(function(book) {
    if (book) {
      return book.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect(303, '../books');   
  }).catch(function (err) {

    // input doesn't match the database model
    // rebuild the page with all required tables and populate inputs with request body
    if (err.name === "SequelizeValidationError"){
      var book = db.books.build(req.body);
      book.id = req.query.id;
      res.render("book_details", {
        book: book,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function () {
    res.send(500);
  });
});

module.exports = router;
