var express = require('express');
var router = express.Router();

/* GET books page. */
router.get('/', function(req, res, next) {
  res.render('books');
});

module.exports = router;