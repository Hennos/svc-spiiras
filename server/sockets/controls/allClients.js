var _ = require('lodash');
var eachSeries = require('async/eachSeries');

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
      if (client.request.user.username === socket.request.user.username) {
        client.disconnect(true);
      }
    });

    clients.push(socket);

    socket.on(Events.disconnect, function () {
      clients.splice(clients.indexOf(socket), 1);
    });

    socket.on(Events.getUserData, function () {
      var data = _.pick(socket.request.user, [
        'username',
        'friends'
      ]);

      var friends = [];
      eachSeries(
        data.friends,
        function (friend, callback) {
          userModel.findById(friend, function (err, found) {
            if (err) return callback(err);
            friends.push(
              _.pick(found, ['username'])
            );
            callback();
          })
        },
        function (err) {
          if (err) throw err;
          data.friends = friends;
          socket.emit(Events.newUserData, JSON.stringify(data));
        }
      );
    });

    socket.on(Events.addFriendToUser, function (pack) {
      var data = JSON.parse(pack);
      userModel.findOne({username: data.username}, function (err, user) {
        if (err) throw err;
        userModel.findOne({username: data.friend}, function (err, friend) {
          if (err) throw err;
          user.friends.push(friend._id);
          user.save();
        })
      });
    });

    socket.on(Events.removeFriendFromUser, function (pack) {
      var data = JSON.parse(pack);
      userModel.findOne({username: data.username}, function (err, user) {
        if (err) throw err;
        userModel.findOne({username: data.friend}, function (err, friend) {
          if (err) throw err;
          user.friends = _.filter(user.friends, function (iterFriend) {
            return !(_.isEqual(iterFriend, friend._id));
          });
          user.save();
        })
      });
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