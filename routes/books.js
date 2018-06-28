var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

var moment = require('moment'); // generating todays date

var Sequelize = require('../models').sequelize;
const Op = Sequelize.Op; // Sequelize operators for queries

// GET all /books routes
// check query string parameter and do the right query
router.get('/', function(req, res, next) {

  // GET /books
  // all books, ordered by title
  if(!req.query.id && !req.query.filter) {
    db.books.findAll({order: [["title", "ASC"]]}).then(function(books){
      res.render("books", {books: books});
    }).catch(function(error){
        res.send(500, error);
    }); 
  } 
  
  // GET /books?id=
  // details/edit page for the requested book.id
  else if (req.query.id) { 
    const bookID = req.query.id;

    // find rigth book, include all loans
    db.books.findById(bookID).then(function (book) {
      db.loans.findAll({
        where: {
          book_id: bookID
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
      }).then(function (loans) {
          res.render('book_details', {book: book, loans: loans});
      }).catch(err => {
        if(err) {
          res.sendStatus(500);
        }
      });
    });
  }

  // GET /books?filter=overdue
  // all books with overdue loan
  else if (req.query.filter == 'overdue') {
    // find all overdue loans
    db.loans.findAll({
      where: {
        return_by: {
          [Op.lt]: moment()
        },
        returned_on: null
      }
    }).then(function (loans) {
      // get all book IDs from overdue loans in an array
      const overdueIDs = [];
      loans.forEach(loan => {
        overdueIDs.push(loan.book_id);
      });
      // find all books matching the book IDs
      db.books.findAll({
        where: {
          id: overdueIDs
        },
        order: [
          ["title", "ASC"]
        ]
      // render all the overdue books
      }).then(function (books) {
        res.render('books', {books: books});
      });
    });
  }
  
  
  // GET /books?filter=checkedout
  // all books with returned loan
  else if (req.query.filter == 'checked_out') {
    // find all returned loans
    db.loans.findAll({
      where: {
        returned_on: {
          [Op.not]: null
        }
      }
    }).then(function (loans) {
      // get all book IDs from checked out loans in an array
      const checkedOutIDs = [];
      loans.forEach(loan => {
        checkedOutIDs.push(loan.book_id);
      });
      // find all books matching the book IDs
      db.books.findAll({
        where: {
          id: checkedOutIDs
        },
        order: [
          ["title", "ASC"]
        ]
      // render all checked out books
      }).then(function (books) {
        res.render('books', {books: books});
      });
    });
  }
});

// POST /books/id=?
// update book with input from the request body
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
    if (err.name === "SequelizeValidationError"){
      // input doesn't match the database model
      // rebuild page with error messages and populate inputs with request body
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
