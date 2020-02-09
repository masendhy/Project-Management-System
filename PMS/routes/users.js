var express = require('express');
var router = express.Router();
var helpers = require('../helpers/util');
const bcrypt = require('bcrypt');
const saltRounds = 8;
let nav = 3;


module.exports = (pool) => {

    router.get('/', helpers.isLoggedIn,(req, res, next) => {
      const {
        checkid,
        id,
        checkemail,
        email,
        checkfirstname,
        firstname,
        checklastname,
        lastname,
        checkposition,
        position,
        checkjobtype,
        jobtype
      } = req.query;
      let temp = []
      const url = (req.url == '/') ? `?page=1` : req.url
      let page = req.query.page || 1;
      let limit = 3;
      let offset = (page - 1) * limit
      console.log(req.url)
  
      if (checkid && id) {
        temp.push(`users.userid = ${id}`)
      }
  
      if (checkemail && email) {
        temp.push(`users.email ILIKE '%${email}%'`)
      }
  
      if (checkfirstname && firstname) {
        temp.push(`users.firstname = '${firstname}' `)
      }
      if (checklastname && lastname) {
        temp.push(`users.lastname = '${lastname}' `)
      }
  
      if (checkposition && position) {
        temp.push(`users.position = '${position}'`)
      }
  
      if (checkjobtype && jobtype) {
        temp.push(`users.isfulltime = '${jobtype}'`)
      }
  
      let sql = `SELECT COUNT(*) as total FROM users`
      if (temp.length > 0) {
        sql += ` Where ${temp.join(" AND ")}`
      }
  
      pool.query(sql, (err, count) => {
        const total = count.rows[0].total
        const pages = Math.ceil(total / limit)
  
        let sql = `SELECT * FROM users`;
  
        if (temp.length > 0) {
          sql += ` Where ${temp.join(" AND ")}`
        }
  
        sql += ` ORDER BY userid LIMIT ${limit} OFFSET ${offset}`;
  
        pool.query(sql, (err, row) => {
          pool.query(`SELECT memberopt FROM users WHERE userid = ${req.session.user.userid}`, (err, data) => {
            res.render('users/user', {
              data: row.rows,
              query: req.query,
              option: data.rows[0].memberopt,
              pages: pages,
              page: page,
              url: url,
              nav
            })
          });
  
        })
      })
  
    })
  
    // Option
    router.post('/option', helpers.isLoggedIn, (req, res) => {
  
      let sql = `UPDATE users SET memberopt = '${JSON.stringify(req.body)}' WHERE userid =${req.session.user.userid} `
      console.log(sql);
      console.log(req.session.user);
      pool.query(sql, (err) => {
        if (err) throw err;
  
        res.redirect('/users');
      })
  
    })
    // const sqlselct = `SELECT * FROM users`;

    // pool.query(sqlselct, (err, response) => {
    //   if (err) {
    //     throw err
    //   }
    //   res.render('users/user', {
    //     data: response.rows
    //   });
    // })
  

  //ADD

  router.get('/add',helpers.isLoggedIn, (req, res, next) => {
    res.render('users/add', {
    user: req.session.user,
    
    });
  })

  router.post('/add', helpers.isLoggedIn, (req, res, next) => {
    let check = `{"idChecked":"true","firstnameChecked":"true","lastnameChecked":"true","jobtypeChecked":"true","positionChecked":"true"}`
    const sqlAdd = `INSERT INTO users(email, password, firstname, lastname, isfulltime, position,memberopt) VALUES ('${req.body.email}','${req.body.password}','${req.body.firstname}','${req.body.lastname}','${req.body.isfulltime}','${req.body.position}','${check}')`;
    console.log(sqlAdd);

    pool.query(sqlAdd, (err) => {
      if (err) {
        throw err
      }
      res.redirect('/users');s
    });
  });

  // EDIT 

  router.get('/edit/:userid', helpers.isLoggedIn,(req, res, next) => {
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
router.post('/edit/:userid',helpers.isLoggedIn, (req, res, next) => {
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
  router.get('/delete/:userid', helpers.isLoggedIn,(req, res, next) => {
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







