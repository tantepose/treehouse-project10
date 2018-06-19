var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET new book page
router.get('/', function(req, res, next) {
  res.render("patrons_new", {patron: db.patrons.build()});
});

// POST new book, saving to database
router.post('/', function(req, res, next) {
  db.patrons.create(req.body).then(function() {
    res.redirect(303, '../patrons');
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError"){
      res.render("patrons_new", {
        patron: db.patrons.build(req.body),
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function(err) {
    res.sendStatus(500);
  }); 
}); 
//mer error handling? se blogg-greia som du lagde med treehouse

module.exports = router;
