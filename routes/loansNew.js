var express = require('express');
var router = express.Router();
var db = require("../models/index.js");
var moment = require('moment');

// GET new loan
router.get('/', function(req, res, next) {
    // seting up new loan with new dates
    var today = moment();
    var loan = db.loans.build();
    loan.loaned_on = today; // loaned today
    loan.return_by = today.add(1, 'week'); // return by one week from now

    // get patrons and books for select boxes before rendering
    db.patrons.findAll({order: [["first_name", "ASC"]]}).then(function (patrons) {
        var patrons = patrons;
        db.books.findAll({order: [["title", "ASC"]]}).then(function (books) {
            var books = books;
            res.render("loans_new", {loan: loan, books: books, patrons: patrons});
        });
    }); //husk error handling
});

// POST new loan
router.post('/', function(req, res, next) {
  console.log('LAGER NYTT LÅN ***');
  db.loans.create(req.body).then(function() {
    res.redirect(303, '../loans');
    console.log('LÅN LAGET');
  }).catch(function (err) {
      console.log('ERROR HEEER');
    if (err.name === "SequelizeValidationError"){
        // console.log('minnet:', loan,books,patrons,errors);
        console.log('SQL ERROR HEEEER');
        
        db.patrons.findAll({order: [["first_name", "ASC"]]}).then(function (patrons) {
            var patrons = patrons;
            db.books.findAll({order: [["title", "ASC"]]}).then(function (books) {
                var books = books;
                res.render("loans_new", {loan: db.loans.build(req.body), books: books, patrons: patrons, errors: err.errors});
            });
        });  
        // res.render("loans_new", {
        //     loan: db.loans.build(req.body),
        //     books: books,
        //     patrons: patrons,
        //     errors: err.errors           
        // });
    } else {
        console.log('error nedi her?');
        throw err;
    }
  }).catch(function(err) {
      console.log('error helt her!', err);
    res.sendStatus(500);
  }); 
}); 
//mer error handling? se blogg-greia som du lagde med treehouse

module.exports = router;
