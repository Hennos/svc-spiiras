var express = require('express');
var passport = require('passport');
var User = require('../mongoose/models/user');
var router = express.Router();



/* GET registration page. */
router.get('/', function(req, res, next) {
    if (req.isAuthenticated())
        res.redirect('/index');
    else
        res.render('registration', { title: 'registration' });


});

router.post('/', function(req, res) {
    console.log(req.body.email, req.body.username, req.body.password);
    User.register(new User({ email : req.body.email, username: req.body.username}), req.body.password, function(error, account) {
        if (error) {

            console.error(err);

            if(error.name === 'UserExistsError')
                return res.render("registration", {title: 'registration', info: "Извините, данное имя пользователя уже занято. Попробуйте другое."});
            if(error.name === 'MongoError' && error.code === 11000)
                return res.render("registration", {title: 'registration', info: "Извините, данная электронная почта уже занята. Попробуйте другую."});



            return res.render("registration", {title: 'registration', info: "Извините, ошибка сервера. Попробуйте позже."});
        }
        console.log(req.body.email, req.body.username, req.body.password);

        res.redirect('login');


    });
});

module.exports = router;