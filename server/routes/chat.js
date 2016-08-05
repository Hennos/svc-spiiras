var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {

  if (req.isAuthenticated()) {
    res.render('chat', {userEnabled: true});
  }
  else {
    res.redirect('/login');
  }
});

module.exports = router;