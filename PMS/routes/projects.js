  
var express = require('express');
var router = express.Router();
const path = require('path');
var moment = require('moment');
const {isLoggedIn} = require("../helpers/util")

module.exports = (pool) => {


/* GET HOME PAGE */

  router.get('/', function(req, res, next) {
    res.render('project/projects');
  });

  router.get('/add', function(req, res, next) {
    res.render('project/add');
  });

  router.get('/edit', function(req, res, next) {
    res.render('project/edit');
  });

  router.get('/overview', function(req, res, next) {
    res.render('project/overview');
  });

  router.get('/activity', function(req, res, next) {
    res.render('project/activity');
  });

  router.get('/members', function(req, res, next) {
    res.render('project/members');
  });

  router.get('/members/addMembers', function(req, res, next) {
    res.render('project/addMembers');
  });

  router.get('/issues', function(req, res, next) {
    res.render('project/issues');
  });

  router.get('/issues/addIssues', function(req, res, next) {
    res.render('project/addIssues');
  });
    
  return router;
}


