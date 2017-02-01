var express = require('express');
var router = express.Router();

/* GET Chat page. */
router.get('/', function (req, res, next) {
  if (req.isAuthenticated()) {
    res.render('Chat', {title: 'Chat'});
  }
  else {
    res.render('login', {title: 'login'});
  }
});

module.exports = router;