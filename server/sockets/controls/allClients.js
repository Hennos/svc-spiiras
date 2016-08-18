var _ = require('lodash');
var eachSeries = require('async/eachSeries');

var Events = {
  connected: 'connection',
  disconnect: 'disconnect',
  getUserData: "GET:USER:DATA",
  addFriendToUserSuccessful: "ADD:FRIEND:TO:USER",
  removeFriendFromUserSuccessful: "REMOVE:FRIEND:FROM:USER",
  getAddingFriend: "EMIT:ADDING:FRIEND",
  getRemovingFriend: "EMIT:REMOVING:FRIEND",
  newUserData: "NEW:USER:DATA",
  changeSearchedPeople: "NEW:SEARCH_PEOPLE:PEOPLE",
  changePatternSearchPeople: "EMIT:SEARCH:PEOPLE:INPUT:CHANGE"
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
      var user = _.pick(socket.request.user, [
        'username',
        'friends'
      ]);

      var friends = [];
      eachSeries(
        user.friends,
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
          user.friends = friends;
          socket.emit(Events.newUserData, JSON.stringify(user));
        }
      );
    });

    socket.on(Events.getAddingFriend, function (pack) {
      var friendName = JSON.parse(pack);
      userModel.findOne(
        {username: friendName},
        {username: 1},
        function (err, friend) {
          if (err) throw err;
          userModel.findOne(
            {username: socket.request.user.username},
            function (err, user) {
              if (err) throw err;
              const newFriends = user.friends.concat(friend._id);
              user.update(
                {$set: {friends: newFriends}, $inc: {__v: 1}},
                function (err) {
                  if (err) throw err;
                  socket.emit(
                    Events.addFriendToUserSuccessful,
                    _.pick(friend, ['username'])
                  );
                }
              );
            }
          );
        }
      )
    });

    socket.on(Events.getRemovingFriend, function (pack) {
      var friendName = JSON.parse(pack);
      userModel.findOne(
        {username: friendName},
        {username: 1},
        function (err, friend) {
          if (err) throw err;
          userModel.findOne(
            {username: socket.request.user.username},
            function (err, user) {
              if (err) throw err;
              const newFriends = _.filter(
                user.friends,
                function (curFriend) {
                  return !(_.isEqual(curFriend, friend._id));
                });
              user.update(
                {$set: {friends: newFriends}, $inc: {__v: 1}},
                function (err) {
                  if (err) throw err;
                  socket.emit(
                    Events.removeFriendFromUserSuccessful,
                    _.pick(friend, 'username')
                  );
                }
              );
            }
          );
        }
      )
    });

    socket.on(Events.changePatternSearchPeople, function (pack) {
      var input = JSON.parse(pack);
      if (input != '') {
        const regexFindPattern = new RegExp('^' + input + '.*', 'i');
        userModel.findOne(
          {username: socket.request.user.username},
          {_id: 0, username: 1, friends: 1},
          function (err, user) {
            userModel.find(
              {
                username: {$regex: regexFindPattern, $ne: user.username},
                _id: {$nin: user.friends}
              },
              {_id: 0, username: 1},
              function (err, result) {
                if (err) throw err;
                socket.emit(Events.changeSearchedPeople, JSON.stringify(result));
              }
            );
          }
        );
      } else {
        socket.emit(Events.changeSearchedPeople, '[]');
      }
    });
  });

  //userData
  return clients;
}

module.exports = Root;