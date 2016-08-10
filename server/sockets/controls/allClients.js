var _ = require('lodash');

var Events = {
  connected: 'connection',
  disconnect: 'disconnect',
  getUserData: "GET:USER:DATA",
  addFriendToUser: "ADD:FRIEND:TO:USER",
  removeFriendFromUser: "REMOVE:FRIEND:FROM:USER",
  newUserData: "NEW:USER:DATA",
  changePeople: "NEW:SEARCH_PEOPLE:PEOPLE",
  changePatternSearchPeople: "NEW:SEARCH_PEOPLE:VALUE"
};

var userModel = require('../../mongoose/models/user');

function Root(io) {
  var clients = [];

  //connection
  io.on(Events.connected, function (socket) {
    console.log("this work");
    _(clients).forEach(function (client) {
      console.log(client.request.user.username === socket.request.user.username);
      if (client.request.user.username === socket.request.user.username) {
        client.disconnect(true);
      }
    });

    clients.push(socket);

    socket.on(Events.disconnect, function () {
      clients.splice(clients.indexOf(socket), 1);
    });

    socket.on(Events.getUserData, function () {
      socket.emit(Events.newUserData, JSON.stringify(
        _.pick(socket.request.user, [
          'username',
          'friends'
        ]))
      );
    });

    socket.on(Events.addFriendToUser, function (pack) {
      console.log(pack);
    });

    socket.on(Events.removeFriendFromUser, function (pack) {
      console.log(pack);
    });

    socket.on(Events.changePatternSearchPeople, function (pack) {
      var data = JSON.parse(pack);
      if (data.input != '') {
        const regexPattern = new RegExp('^' + data.input + '.*', 'i');
        const ninPattern = data.friends.concat(data.username);
        userModel.find({
            username: {
              $regex: regexPattern,
              $nin: ninPattern
            }
          },
          {_id: 0, username: 1},
          function (err, docs) {
            if (err) throw err;
            socket.emit(Events.changePeople, JSON.stringify(docs));
          });
      } else {
        socket.emit(Events.changePeople, '[]');
      }
    });
  });

  //userData
  return clients;
}

module.exports = Root;