var express = require('express');
var router = express.Router();

/* GET chat page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('chat', {title: 'chat'});
  }
  else {
    res.render('login', {title: 'login'});
  }
});

module.exports = router;