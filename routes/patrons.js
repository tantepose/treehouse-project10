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
      console.log("SE HER:");
      console.log(patron.loans.id)
  
    }).catch(function(error){
      console.error("Error:", error);
      res.send(500, error);
    });
  }
});

module.exports = router;

