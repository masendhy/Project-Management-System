var express = require('express');
var router = express.Router();


module.exports = (pool) => {

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('login',{
      info: req.flash('info')
  });
});

/* GET login page. */
router.post('/login', (req, res, next) => {
  let { email,  password
  } = req.body;
  console.log(email + ' ' + password)
  // let email = req.body.email;
  // let password = req.body.password;
  pool.query(
    `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`,
    (err, data) => {
      if(err) return res.send(err);
      if (data.rows.length > 0) {
        if (data.rows[0].email == email && data.rows[0].password == password) {
          data.rows[0].password = null;
          req.session.user = data.rows[0];
          console.log("data session ", req.session.user);
          res.redirect("/projects");
        }
      } else {
        // res.send( "Email & Passwords is wrong");
        req.flash('info', "Email and Password is wrong");
        res.redirect("/");
      }
    }
  );
});


// LOG OUT
router.get("/logout", (req, res, next) => {
  req.session.destroy = () => {
    res.redirect("/");
  };
});


 return router;
}


