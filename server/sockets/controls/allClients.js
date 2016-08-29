var crypto = require('crypto');
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
  changePatternSearchPeople: "EMIT:SEARCH:PEOPLE:INPUT:CHANGE",
  callerStartConference: "START:CONFERENCE",
  callerAddToConference: "EMIT:ADDED:SIDE",
  sideJoinConference: "ADD:SIDE:TO:CHAT",
  sideChangeConference: "CHANGE:CONFERENCE",
  sideLeaveConference: "REMOVE:SIDE:FROM:CHAT",
  callerCloseConference: "EMIT:CLOSE:CONFERENCE",
  sideAlreadyCalled: "SIDE:ALREADY:CALLED",
  sideNotAvailable: "SIDE:NOT:AVAILABLE"
};

var userModel = require('../../mongoose/models/user');

function Root(io) {
  var clients = {};

  //connection
  io.on(Events.connected, function (socket) {
    console.log("this work");
    var socketUser = socket.request.user;
    if (clients[socketUser.username]) {
      clients[socketUser.username].disconnect(true);
      return clients;
    }

    clients[socketUser.username] = socket;
    var roomId = crypto.randomBytes(32).toString('hex');
    socket.join(roomId, function (err) {
      if (err) throw err;
      clients[socketUser.username].roomId = roomId;
    });

    socket.on(Events.disconnect, function () {
      socket.broadcast.to(roomId).emit(Events.sideLeaveConference, socketUser.username);
      delete clients[socketUser.username];
    });

    socket.on(Events.getUserData, function () {
      var user = _.pick(socketUser, [
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
            {username: socketUser.username},
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
            {username: socketUser.username},
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
          {username: socketUser.username},
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

    socket.on(Events.callerAddToConference, function (side) {
      debugger;
      var caused = clients[side];
      if (!caused) {
        socket.emit(Events.sideNotAvailable);
        return false;
      }
      if (caused.roomId === roomId) {
        socket.emit(Events.sideAlreadyCalled);
        return false;
      }
      io.to(caused.roomId).emit(
        Events.sideChangeConference,
        JSON.stringify(
          io.sockets.clients(roomId).map(function (elem) {
            return _.pick(elem.user, ['username']);
          })
        )
      );
      io.to(roomId).emit(
        Events.sideChangeConference,
        JSON.stringify(
          io.sockets.clients(caused.roomId).map(function (elem) {
            return _.pick(elem.user, ['username']);
          })
        )
      );
      io.sockets.clients(caused.roomId).forEach(function (elem) {
        elem.leave(caused.roomId);
        elem.join(roomId);
        elem.roomId = roomId;
      });
    });

    socket.on(Events.callerCloseConference, function () {

    });
  });

  //userData
  return clients;
}

module.exports = Root;