var nconf = require('nconf');

var expressSession = require('express-session');
var passportSocketIo = require("passport.socketio");
var cookieParser = require('cookie-parser');
var port = nconf.get('socket').port;

var createIOServer = function (app, sessionStore) {
  var server = require('http').createServer(app);
  var io = require("socket.io")(server);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key: nconf.get('session').key,       // the name of the cookie where express/connect stores its session_id
    secret: nconf.get('session').secret,    // the session_secret to parse the cookie
    store: sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail: onAuthorizeFail     // *optional* callback on fail/error - read more below
  }));

  var clients = require('./controls/allClients')(io);

  function onAuthorizeSuccess(data, accept) {
    accept();
  }

  function onAuthorizeFail(data, message, error, accept) {
    if (error) throw new Error(message);
    console.error('failed authorize to socket.io:', message);

    // If you use socket.io@1.X the callback looks different
    // If you don't want to accept the connection
    if (error) accept(new Error(message));
    // this error will be sent to the user as a special error-package
    // see: http://socket.io/docs/client-api/#socket > error-object
  }

  /**
   * Event listener for HTTP server "error" event.
   */

  function onError(error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  /**
   * Event listener for HTTP server "listening" event.
   */

  function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    console.info('Socket server listening on ' + bind);
  }

  return io;
};

module.exports = createIOServer;

