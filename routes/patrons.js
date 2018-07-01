var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET all /patrons routes
// check query to do the right thing
router.get('/', function(req, res, next) {
  
  // GET /patrons
  // no patron ID defined, render patron list
  if(!req.query.id) {
    db.patrons.findAll({
      order: [["first_name", "ASC"]]
    }).then(function(patrons){
      res.render("patrons", {patrons: patrons});
    }).catch(function(error){
      res.sendStatus(500, error);
    });
  }

  // GET /patrons?id=
  // patron ID defined, render patron edit / details
  else {
    db.patrons.findOne({
      where: {
        id: req.query.id
      },
      include: [
        {
          model: db.loans,
          include: [
            {
              model: db.books,
              as: 'book'
            }]
        }]
    }).then(function (patron) {
      res.render("patron_details", {patron: patron});
    }).catch(function(error){
      res.sendStatus(500, error);
    });
  }
});

// POST /patrons?id=
// edit patron with data from request body
router.post('/', function(req, res, next){
  db.patrons.findById(req.query.id).then(function(patron) {
    if (patron) {
      return patron.update(req.body);
    } else {
      res.sendStatus(404);
    }
  }).then(function(){
    res.redirect(303, '../patrons');   
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError"){
      // input doesn't match the database model
      // rebuild page with error messages and populate inputs with request body
      var patron = db.patrons.build(req.body);
      patron.id = req.query.id;
      res.render("patron_details", {
        patron: patron,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function (error) {
    res.sendStatus(500, error);
  });
});

module.exports = router;

