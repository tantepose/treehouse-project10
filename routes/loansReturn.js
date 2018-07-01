var express = require('express');
var router = express.Router();
var db = require("../models/index.js");
var moment = require('moment');

// GET return book
router.get('/', function (req, res, next) {
      db.loans.findOne({
        where: {
          id: req.query.id
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
        ]
      }).then(function (loan) {
        loan.returned_on = moment();
        res.render("loans_return", {loan: loan});
      }).catch(function(error){
        res.send(500, error);
      });
  });
  
  // POST return book
  router.post('/', function(req, res, next){
    db.loans.findById(req.query.id).then(function (loan) {
      if (loan) {
        return loan.update(req.body);
      } else {
        res.send(404);
      }
    }).then(function() {
      res.redirect(303, '../loans');   
    }).catch(function (err) {
      if (err.name === "SequelizeValidationError"){
        // input doesn't match the database model
        // rebuild page by reloading all data, plus errors
        db.loans.findOne({
          where: {
            id: req.query.id
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
          ]
        }).then(function (loan) {
          loan.returned_on = moment();
          res.render("loans_return", { loan: loan, errors: err.errors });
        });
      } else {
        throw err;
      }
    }).catch(function () {
      res.send(500);
    });
  });

module.exports = router;
