var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util');
const bcrypt = require('bcrypt');
const saltRounds = 8;


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

  //ADD

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

  // EDIT 

  router.get('/edit/:userid', (req, res, next) => {
    const userid = req.params.userid;
    const sqlEdit = `SELECT * FROM users WHERE userid = ${userid}`;
    pool.query(sqlEdit, (err, data) => {
      if (err) {
        throw err
      }
      res.render('users/edit', {
        data: data.rows[0]
      })
    })
  })

/* post edit users. */
router.post('/edit/:userid', function (req, res, next) {
  const userid = req.params.userid;
  let sql = `UPDATE users SET firstname = $1, lastname = $2, email = $3, password = $4, position = $5, isfulltime = $6  WHERE (userid = $7) `;
   const data = [req.body.firstname, req.body.lastname, req.body.email, req.body.password, req.body.position, req.body.isfulltime, userid]
 
   pool.query(sql, data, (err) => {
     if (err) {
       throw err
     }
     res.redirect('/users');
 
   });
  });

  //Delete Data
  router.get('/delete/:userid', (req, res, next) => {
    const userid = req.params.userid;
    const sqldelete = `DELETE FROM users WHERE userid = ${userid}`;
    pool.query(sqldelete, (err) => {
      if (err) {
        throw err
      }
      res.redirect('/users')
    })
  })

  return router;
}







