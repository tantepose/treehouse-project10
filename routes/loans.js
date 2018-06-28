var express = require('express');
var router = express.Router();
var db = require("../models/index.js");

var Sequelize = require('../models').sequelize;
const Op = Sequelize.Op; // Sequelize operators for queries

var moment = require('moment'); // generating todays date

// GET /loans(?filter=) routes
// check query string parameter and do the right query
router.get('/', function(req, res, next) {
    
    // the /loans root, no filter
    // get all loans, ordered by loaned_on
    if (!req.query.filter) {
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
        res.send(500, error);
      });
    } 

    // the /loans?filter=checked_out route
    // get loans where returned_on is not empty
    else if (req.query.filter == 'checked_out') {
        db.loans.findAll({
          where: {
            returned_on: {
              [Op.not]: null
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
          res.send(500, error);
        });
      }

      // ?filter=overdue
      // get loans where return_on date is before today, and returned_on is null
      else if (req.query.filter == 'overdue') {
        db.loans.findAll({
          where: {
            return_by: {
              [Op.lt]: moment()
            },
            returned_on: null
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
          res.send(500, error);
        });
      }
});

module.exports = router;