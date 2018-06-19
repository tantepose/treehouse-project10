var express = require('express');
var router = express.Router();
var Sequelize = require('../models').sequelize;

const Op = Sequelize.Op;
var moment = require('moment');
var db = require("../models/index.js");

router.get('/', function(req, res, next) {
  // check url filter, do apropriate thing
  switch(req.query.filter) {
    case undefined: 
      console.log("*** ROOT ***");
        db.loans.findAll({
          include: [
            {
              model: db.patrons,
              as: "patron"
            },
            {
              model: db.books,
              as: "book"
            }
          ], 
          order: [
            ["loaned_on", "DESC"]
          ]
        }).then(function (loans) {
          res.render("loans", {loans: loans});
      
        }).catch(function(error){
          console.error("Error:", error);
          res.send(500, error);
        });
    break;

    case 'checked_out':
      console.log("*** CHECKED OUT ***");
        db.loans.findAll({
          where: {
            returned_on: {
              [Op.not]: ''
            }
          },
          include: [
            {
              model: db.patrons,
              as: "patron"
            },
            {
              model: db.books,
              as: "book"
            }
          ],
            order: [
              ["loaned_on", "DESC"]
            ]
        }).then(function (loans) {
          res.render("loans", {loans: loans});
      
        }).catch(function(error){
          console.error("Error:", error);
          res.send(500, error);
        });
      break;

      case 'overdue':
        console.log("*** OVERDUE ***");

        const today = moment();//.format('YYYY-MM-DD');
        console.log("TODAY:", today);

        db.loans.findAll({
          where: {
            return_by: {
              [Op.lt]: today
            }
          },
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
      break;
  }
});

module.exports = router;