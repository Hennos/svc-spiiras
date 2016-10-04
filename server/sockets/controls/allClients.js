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
  callerAddToConference: "EMIT:ADDED:SIDE",
  sideChangeConference: "ADD:SIDES:TO:CONFERENCE",
  sideLeaveConference: "REMOVE:SIDE:FROM:CONFERENCE",
  callerCloseConference: "EMIT:CLOSE:CONFERENCE",
  closeConference: "CLOSE:CONFERENCE",
  sideAlreadyCalled: "SIDE:ALREADY:CALLED",
  sideNotAvailable: "SIDE:NOT:AVAILABLE",
  handleWebRTCMessage: "WEB:RTC:MESSAGE",
  responseWebRTCMessage: "WEB:RTC:RESPONSE:MESSAGE",
  sendNewPeers: "SEND:NEW:PEERS"
};

var userModel = require('../../mongoose/models/user');

function Root(io) {
  var clients = {};

  //connection
  io.on(Events.connected, function (socket) {
    console.log("this work");
    var socketUser = socket.request.user;
    if (clients[socketUser.username]) {
      clients[socketUser.username]
        .broadcast
        .to(clients[socketUser.username].roomId)
        .emit(Events.sideLeaveConference, socketUser.username);
      clients[socketUser.username].emit(Events.closeConference);
      clients[socketUser.username].disconnect(true);
      return clients;
    }

    clients[socketUser.username] = socket;

    refreshSocketsRoom(socket);

    socket.on(Events.disconnect, function () {
      socket
        .broadcast
        .to(socket.roomId)
        .emit(Events.sideLeaveConference, socketUser.username);
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
          if (err) {
            throw err;
          }
          user.friends = friends;
          socket.emit(Events.newUserData, user);
        }
      );
    });

    socket.on(Events.getAddingFriend, function (friendName) {
      userModel.findOne(
        {username: friendName},
        {username: 1},
        function (err, friend) {
          if (err) {
            throw err;
          }
          userModel.findOne(
            {username: socketUser.username},
            function (err, user) {
              if (err) throw err;
              const newFriends = user.friends.concat(friend._id);
              user.update(
                {$set: {friends: newFriends}, $inc: {__v: 1}},
                function (err) {
                  if (err) {
                    throw err;
                  }
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

    socket.on(Events.getRemovingFriend, function (friendName) {
      userModel.findOne(
        {username: friendName},
        {username: 1},
        function (err, friend) {
          if (err) {
            throw err;
          }
          userModel.findOne(
            {username: socketUser.username},
            function (err, user) {
              if (err) {
                throw err;
              }
              const newFriends = _.filter(
                user.friends,
                function (curFriend) {
                  return !(_.isEqual(curFriend, friend._id));
                });
              user.update(
                {$set: {friends: newFriends}, $inc: {__v: 1}},
                function (err) {
                  if (err) {
                    throw err;
                  }
                  socket.emit(
                    Events.removeFriendFromUserSuccessful,
                    friend.username
                  );
                }
              );
            }
          );
        }
      )
    });

    socket.on(Events.changePatternSearchPeople, function (pack) {
      var input = pack;
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
                if (err) {
                  throw err;
                }
                socket.emit(Events.changeSearchedPeople, result);
              }
            );
          }
        );
      } else {
        socket.emit(Events.changeSearchedPeople, []);
      }
    });

    socket.on(Events.callerAddToConference, function (side) {
      var caused = clients[side];
      if (!caused) {
        socket.emit(Events.sideNotAvailable);
        return false;
      }
      if (caused.roomId === socket.roomId) {
        socket.emit(Events.sideAlreadyCalled);
        return false;
      }
      io.to(caused.roomId).emit(
        Events.sideChangeConference,
        getSocketsInRoom(socket.roomId).map(function (iterSocket) {
          return _.pick(iterSocket.request.user, ['username']);
        })
      );
      io.to(socket.roomId).emit(
        Events.sendNewPeers,
        getSocketsInRoom(caused.roomId).map(function (iterSocket) {
          return iterSocket.request.user.username;
        })
      );
      io.to(socket.roomId).emit(
        Events.sideChangeConference,
        getSocketsInRoom(caused.roomId).map(function (iterSocket) {
          return _.pick(iterSocket.request.user, ['username']);
        })
      );
      getSocketsInRoom(caused.roomId).forEach(function (elem) {
        elem.leave(caused.roomId, function (err) {
          if (err) {
            throw err;
          }
          elem.join(socket.roomId, function (err) {
            if (err) {
              throw err;
            }
            elem.roomId = socket.roomId;
          });
        });
      });
    });

    socket.on(Events.callerCloseConference, function () {
      socket
        .broadcast
        .to(socket.roomId)
        .emit(Events.sideLeaveConference, socketUser.username);
      socket.leave(socket.roomId);
      refreshSocketsRoom(socket);
    });

    // Candidate-Offer-Answer WebRTC
    socket.on(Events.handleWebRTCMessage, function (message) {
      var data = message;
      if ((data.side !== undefined) && (clients[data.side] !== undefined)) {
        var callyClient = clients[data.side];
        data.side = socketUser.username;
        callyClient.emit(Events.responseWebRTCMessage, data);
      } else {
        data.side = socketUser.username;
        socket
          .broadcast
          .to(socket.roomId)
          .emit(Events.responseWebRTCMessage, data);
      }
    });
  });

  //userData
  return clients;

  function getSocketsInRoom(roomId) {
    var res = []
      , room = io.sockets.adapter.rooms[roomId];
    if (room) {
      for (var id in room.sockets) {
        res.push(io.sockets.adapter.nsp.connected[id]);
      }
    }
    return res;
  }

  function refreshSocketsRoom(socket) {
    var roomId = crypto.randomBytes(32).toString('hex');
    socket.join(roomId, function (err) {
      if (err) {
        throw err;
      }
      socket.roomId = roomId;
    });
  }
}

module.exports = Root;