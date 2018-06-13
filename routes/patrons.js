var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

// GET all patrons
router.get('/', function(req, res, next) {
  db.patrons.findAll({order: [["id", "DESC"]]}).then(function(patrons){
    res.render("patrons", {patrons: patrons});
  }).catch(function(error){
      console.error("Error:", error);
      res.send(500, error);
   });
});

module.exports = router;
