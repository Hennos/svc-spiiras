var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
//logger
var logger = require('morgan');
//parsers
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
//configs
var nconf = require('nconf');
nconf
  .argv()
  .env()
  .file({file: __dirname+'/config/config.json'});

var flash = require('connect-flash');

// routes
var routes = require('./routes/index');

var login = require('./routes/login');
var registration = require('./routes/registration');
var chat = require('./routes/chat');
var logout = require('./routes/logout');

//passport
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//sessions
var expressSession = require('express-session');
//sessions store
var MongoStore = require('connect-mongo')(expressSession);

//mongoose connection
var mongooseConnection = require('./mongoose/db');

//application express
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// session and passport
var sessionsStore = new MongoStore({mongooseConnection: mongooseConnection});

app.use(expressSession({
  secret: nconf.get('session').secret,
  key: nconf.get('session').key,
  store: sessionsStore,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// passport config
var User = require('./mongoose/models/user');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Create socket.io server
var ioServer = require('./sockets/server')(app, sessionsStore);

// routes
app.use('/', routes);
app.use('/index', routes);
app.use('/login', login);
app.use('/registration', registration);
app.use('/chat', chat);
app.use('/logout', logout);

// compile stylus
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
    .use(jeet())
    .use(rupture());
}

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
