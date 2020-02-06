var express = require('express');
var router = express.Router();

module.exports = (pool) => {


/* GET HOME PAGE */


    router.get('/', function(req, res, next) {
        res.render('profile/profile');
      });

      return router;
}

