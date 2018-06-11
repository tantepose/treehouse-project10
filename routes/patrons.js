var express = require('express');
var router = express.Router();
var patrons = require("../models").patrons;

/* GET books page. */
router.get('/', function(req, res, next) {
  console.log("GET all patrons");

  patrons.findAll({order: [["id", "DESC"]]}).then(function(patrons){
    console.log("Sucsess, rendering patrons");
    res.render("patrons", {patrons: patrons});
  }).catch(function(error){
      console.log("Error:", error);
      res.send(500, error);
   });
});

module.exports = router;
