var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET all loans
router.get('/', function(req, res, next) {
  db.loans.findAll({
    include: [
      {
        model: db.patrons,
        as: "patron"
      },
      {
        model: db.books,
        as: "book"
      }]

  }).then(function (loans) {
    res.render("loans", {loans: loans});

  }).catch(function(error){
    console.error("Error:", error);
    res.send(500, error);
  });
});

module.exports = router;