var express = require('express');
var router = express.Router();


module.exports = (pool) => {

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});

 return router;
}
