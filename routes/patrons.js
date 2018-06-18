var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET all patrons
router.get('/', function(req, res, next) {
  console.log("NÅ:", req.query.filter);
  // no patron ID defined (render /patrons root)
  if(!req.query.id) {
    db.patrons.findAll({order: [["id", "DESC"]]}).then(function(patrons){
      res.render("patrons", {patrons: patrons});
    }).catch(function(error){
        console.error("Error:", error);
        res.send(500, error);
    });
  }

  // patron ID defined (render patrons edit/details)
  else {
    console.log('PATRON ID:' + req.query.id);
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
      console.error("Error:", error);
      res.send(500, error);
    });
  }
});

// edit patron
router.post('/', function(req, res, next){
  console.log('redigerer', req.query.id);

  db.patrons.findById(req.query.id).then(function(patron) {
    if (patron) {
      console.log('REDIGERT', req.query.id);
      return patron.update(req.body);
    } else {
      res.send(404);
    }
  }).then(function(){
    res.redirect(303, '../patrons');   
  }).catch(function (err) {
    if (err.name === "SequelizeValidationError"){
      var patron = db.patrons.build(req.body);
      patron.id = req.query.id;
      res.render("patron_details", {
        patron: patron,
        errors: err.errors
      });
    } else {
      throw err;
    }
  }).catch(function () {
    console.error("Error!");
    res.send(500);
  });
});

module.exports = router;

