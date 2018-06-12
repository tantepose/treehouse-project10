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
        as: "patron"},
        {model: books,
          as: "book"}
      ]
  }).then(function (loans) {
    res.render("loans", {loans: loans});
  }).catch(function(error){
    console.error("Error:", error);
    res.send(500, error);
  });
});

module.exports = router;