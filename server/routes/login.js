var express = require('express');
var router = express.Router();
var passport = require("passport");

/* GET login page. */
router.get('/', function (req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/index');
    else
        res.render('login', {title: 'login'});
});

router.post('/', passport.authenticate('local', {
    successRedirect: '/chat',
    failureRedirect: '/',
    failureFlash: false
}));




module.exports = router;

