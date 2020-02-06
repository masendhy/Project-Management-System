var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util');
const bcrypt = require('bcrypt');
const saltRounds = 8;

// === Origin Get Home Page === \\
module.exports = (pool) => {

  router.get('/', function (req, res, next) {
    const sqlselct = `SELECT * FROM users`;
    
    pool.query(sqlselct, (err, response) => {
      if (err) {
        throw err
      }
      res.render('users/user', {
        data: response.rows
      });
    })
  });

  





  //add

  router.get('/add', (req, res, next) => {
    res.render('users/add');
  })

  router.post('/add', (req, res, next) => {
    const sqlAdd = `INSERT INTO users(email, password, firstname, lastname, isfulltime, position) VALUES ('${req.body.email}','${req.body.password}','${req.body.firstname}','${req.body.lastname}','${req.body.isfulltime}','${req.body.position}')`;
    console.log(sqlAdd);

    pool.query(sqlAdd, (err) => {
      if (err) {
        throw err
      }
      res.redirect('/users');
    })
  })
  return router;
}

// =========================================== \\