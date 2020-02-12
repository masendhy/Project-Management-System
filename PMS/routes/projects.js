var express = require('express');
var router = express.Router();
const path = require('path');
var moment = require('moment');
moment().format();

var helpers = require("../helpers/util")

module.exports = (pool) => {


  /* GET HOME PAGE */

  // router.get('/',(req, res, next) =>{
  //   console.log(req.session.user)
  //   res.render('project/projects');
  // });

  router.get('/', helpers.isLoggedIn, (req, res, next) => {

    const {
      ckid,
      id,
      ckname,
      name,
      ckmember,
      member
    } = req.query;
    const url = (req.url == '/') ? `/?page=1` : req.url
    const page = req.query.page || 1;
    const limit = 3;
    const offset = (page - 1) * limit
    let params = [];
    if (ckid && id) {
      params.push(`projects.projectid = ${id}`);
    }
    if (ckname && name) {
      params.push(`projects.name ILIKE '%${name}%'`)
    }
    if (ckmember && member) {
      params.push(`members.userid = '${member}'`)
    }

    let sql = `SELECT COUNT(id) as total FROM (SELECT DISTINCT projects.projectid AS id FROM projects LEFT JOIN members ON projects.projectid = members.projectid`;
    if (params.length > 0) {
      sql += ` WHERE ${params.join(" AND ")}`
    }
    sql += `) AS projectmember`;
    pool.query(sql, (err, count) => {
      const total = count.rows[0].total;
      const pages = Math.ceil(total / limit);

      sql = `SELECT DISTINCT projects.projectid, projects.name FROM projects LEFT JOIN members ON projects.projectid = members.projectid`
      if (params.length > 0) {
        sql += ` WHERE ${params.join(" AND ")}`
      }
      sql += ` ORDER BY projects.projectid LIMIT ${limit} OFFSET ${offset}`
      let subquery = `SELECT DISTINCT projects.projectid FROM projects LEFT JOIN members ON projects.projectid = members.projectid`
      if (params.length > 0) {
        subquery += ` WHERE ${params.join(" AND ")}`
      }
      subquery += ` ORDER BY projects.projectid LIMIT ${limit} OFFSET ${offset}`
      let sqlMembers = `SELECT projects.projectid, users.userid, CONCAT (users.firstname,' ',users.lastname) AS fullname FROM projects LEFT JOIN members ON projects.projectid = members.projectid LEFT JOIN users ON users.userid = members.userid WHERE projects.projectid IN (${subquery})`

      pool.query(sql, (err, projectData) => {
        if (err) throw err;
        pool.query(sqlMembers, (err, memberData) => {
          projectData.rows.map(project => {
            project.members = memberData.rows.filter(member => {
              return member.projectid == project.projectid
            }).map(data => data.fullname)
          })
          let sqlusers = `SELECT * FROM users`;
          let sqloption = `SELECT projectopt  FROM users  WHERE userid =${req.session.user.userid}`;
          pool.query(sqlusers, (err, data) => {
            pool.query(sqloption, (err, options) => {
              //     return res.send(err)
              // }
              // let sqladmin = `SELECT isadmin FROM users WHERE userid = ${req.session.user.userid}`;
              // pool.query(sqladmin, (err, admin) => {
              //     admin = admin.rows;
              //     let isadmin = admin[0].isadmin;
              res.render('project/projects', {
                data: projectData.rows,
                query: req.query,
                users: data.rows,
                // isadmin,
                page: page,
                pages: pages,
                url: url,
                option: options.rows[0].projectopt,
                user: req.session.user
              })
            })
          })
        })
      })
    })
  })
  // })
  // });

  router.post('/update', (req, res) => {
    let sql = `UPDATE users SET projectopt = '${JSON.stringify(req.body)}' WHERE userid =${req.session.user.userid} `
    pool.query(sql, (err) => {
      if (err) throw err;
      res.redirect('/projects');
    })
  })

  //GET ADD PROJECT
  router.get('/add', helpers.isLoggedIn, (req, res, next) => {
    let sqladd = `SELECT * FROM users`;
    pool.query(sqladd, (err, row) => {
      if (err) {
        throw err
      }
      res.render('project/add', {
        data: row.rows,
        user: req.session.user,
        path,
        dataNull: req.flash('dataNull'),
      })
    })
  })

  /* POST ADD PROJECT */
  router.post('/add', helpers.isLoggedIn, (req, res, next) => {

    const {
      name,
      member
    } = req.body;

    if (name && member) {
      ceklist = true

      const insertId = `INSERT INTO projects (name) VALUES ('${name}')`
      pool.query(insertId, (err, dbProjects) => {
        let selectidMax = `SELECT MAX (projectid) FROM projects`
        pool.query(selectidMax, (err, dataMax) => {
          // console.log("Data Max VVVVV");
          let insertidMax = dataMax.rows[0].max
          // console.log(insertidMax);
          let insertMember = 'INSERT INTO members (userid, role, projectid) VALUES '
          if (typeof member == 'string') {
            insertMember += `(${member}, ${insertidMax});`
          } else {
            let members = member.map(item => {
              return `(${item}, ${insertidMax})`
            }).join(',')
            insertMember += `${members};`
          }
          // console.log(insertMember);
          pool.query(insertMember, (err, dataSelect) => {
            // const lastID = dataSelect.rows
            // console.log(dataSelect);
          })

        })

      })
      res.redirect('/projects');


    } else {

      console.log("data kosong");
      req.flash('dataNull', 'Please Select Member ')
      res.redirect('/projects/add');

    }

  })
  return router;
};