var express = require('express');
var router = express.Router();
// var db = require("../models/index.js");

var patrons = require('../models').patrons;
var books = require('../models').books;
var loans = require('../models').loans;

/* GET books page. */
router.get('/', function(req, res, next) {
  loans.findAll({
    include: [{
        model: patrons,
        model: books
      }]
  }).then(function (loans) {
    res.render("loans", {loans: loans});
  });
});

module.exports = router;

// Executing (default): SELECT `loans`.`id`, 
// `loans`.`book_id`, 
// `loans`.`patron_id`, 
// `loans`.`loaned_on`, 
// `loans`.`return_by`, 
// `loans`.`returned_on`, 
// `loans`.`bookId`, 
// `loans`.`patronId`, 

// `book`.`id` AS `book.id`, 
// `book`.`title` AS `book.title`, 
// `book`.`author` AS `book.author`, 
// `book`.`genre` AS `book.genre`, 
// `book`.`first_published` AS `book.first_published` 
// FROM `loans` AS `loans` 
// LEFT OUTER JOIN `books` AS `book` ON `loans`.`book_id` = `book`.`id`;

// Unhandled rejection SequelizeDatabaseError: SQLITE_ERROR: no such column: loans.bookId