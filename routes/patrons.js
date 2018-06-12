var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

/* GET books page. */
router.get('/', function(req, res, next) {
  console.info("GET all patrons");

  db.patrons.findAll({order: [["id", "DESC"]]}).then(function(patrons){
    console.info("Sucsess, rendering patrons");
    res.render("patrons", {patrons: patrons});
  }).catch(function(error){
      console.error("Error:", error);
      res.send(500, error);
   });
});

module.exports = router;
