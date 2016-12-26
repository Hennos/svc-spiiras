var express = require('express');
var router = express.Router();
var passport = require("passport");
var _ = require('lodash');

const permission = require('../constants/fields').user.permission;

/* GET logout page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    if (!_.get(req.user.permission, permission.passwordExitProfile, false)) {
      req.logout();
      return res.redirect('/login');
    }
  }

  return res.redirect('/index');
});

router.post('/submit', function (req, res, next) {
  if (req.isAuthenticated()) {
    if (req.user.checkUserExit(req.body.exit)) {
      req.logout();
      return res.redirect('login');
    }
    return res.sendStatus(403);
  }
  else {
    res.render('login', {title: 'login'});
  }
});

module.exports = router;