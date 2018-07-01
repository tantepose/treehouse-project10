var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET /books/new
// render the new book page
router.get('/', function(req, res, next) {
  res.render("patrons_new", {patron: db.patrons.build()});
});

// POST /books/new
// saving new book to database, with data from request body
router.post('/', function(req, res, next) {
  db.patrons.create(req.body).then(function () {
    res.redirect(303, '../patrons');
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError"){
      // input doesn't match the database model
      // rebuild page with error messages and populate inputs with request body
      res.render("patrons_new", {
        patron: db.patrons.build(req.body),
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