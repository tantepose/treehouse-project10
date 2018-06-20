var express = require('express');
var router = express.Router();
var db = require("../models/index.js");
var moment = require('moment');

// GET new loan page
router.get('/', function(req, res, next) {

    // set up new loan with new dates
    var today = moment();
    var loan = db.loans.build();
    loan.loaned_on = today; // loaned today
    loan.return_by = today.clone(today.add(1, 'week')); // return_by one week from now

    // get patrons and books for select boxes before rendering
    db.patrons.findAll({order: [["first_name", "ASC"]]}).then(function (patrons) {
        var patrons = patrons;
        db.books.findAll({order: [["title", "ASC"]]}).then(function (books) {
            var books = books;
            res.render("loans_new", {loan: loan, books: books, patrons: patrons});
        });
    }); //husk error handling
});

// POST the new loan
router.post('/', function(req, res, next) {

    // build the new loan from the request body (all input)
    db.loans.create(req.body).then(function() {
        res.redirect(303, '../loans');
    }).catch(function (err) {
    
        // input doesn't match the database model
        // rebuild the page with all required tables and populate inputs with request body
        if (err.name === "SequelizeValidationError"){
            db.patrons.findAll({order: [["first_name", "ASC"]]}).then(function (patrons) {
                var patrons = patrons;
                db.books.findAll({order: [["title", "ASC"]]}).then(function (books) {
                    var books = books;
                    res.render("loans_new", {loan: db.loans.build(req.body), books: books, patrons: patrons, errors: err.errors});
                });
            });  

        // other errors
        } else {
            throw err;
        }
    }).catch(function(err) {
        res.sendStatus(500);
    }); 
}); 

module.exports = router;
