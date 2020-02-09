var express = require('express');
var router = express.Router();
const helpers = require("../helpers/util")

module.exports = (pool) => {


/* GET HOME PAGE */


    router.get('/', (req, res, next) => {
      sql = `SELECT * FROM users WHERE email = '${req.session.user.email}'`;
        pool.query(sql, (err, profile) => {
        res.render('profile/profile',{
          profile: profile.rows[0],
          user: req.session.user,
        });
      });
    })

    //update profile

    /* post edit users. */
    router.post('/', helpers.isLoggedIn, (req, res, next)=> {
        const email = req.session.user.email;
        let sql = `UPDATE users SET firstname = $1, lastname = $2,  password = $3, position = $4, isfulltime = $5  WHERE email = '${req.session.user.email}' `;
        const data = [req.body.firstname, req.body.lastname, req.body.password, req.body.position, req.body.jobtype]

        pool.query(sql, data, (err, data) => {
            if (err) {
                throw err
            }
            res.redirect('/projects');

        });
    });

      return router;
}

