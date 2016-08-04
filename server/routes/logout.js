var express = require('express');
var router = express.Router();
var passport = require("passport");


/* GET logot page. */
router.get('/', function(req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;