var express = require('express');
var router = express.Router();
var database = require("../modules/database");
console.log(database);
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
