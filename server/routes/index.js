var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('index', {userEnabled: true, title: 'index'});
  }
  else {
    res.render('index', {title: 'index'});
  }
});

module.exports = router;
