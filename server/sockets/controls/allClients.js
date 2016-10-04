var crypto = require('crypto');
var _ = require('lodash');
var eachSeries = require('async/eachSeries');

var Events = {
  base: {
    connected: 'connection',
    disconnect: 'disconnect'
  },

  userData: {
    getUserData: "GET:USER:DATA",
    newUserData: "NEW:USER:DATA"
  },

  requests: {
    addRequestToUserSuccessful: "ADD:REQUEST:TO:USER",
    removeRequestFromUserSuccessful: "REMOVE:REQUEST:FROM:USER",
    getAddingRequest: "EMIT:USER:REQUEST",
    getRemovingRequest: "EMIT:REMOVING:REQUEST"
  },

  friends: {
    addFriendToUserSuccessful: "ADD:FRIEND:TO:USER",
    removeFriendFromUserSuccessful: "REMOVE:FRIEND:FROM:USER",
    getAddingFriend: "EMIT:ADDING:FRIEND",
    getRemovingFriend: "EMIT:REMOVING:FRIEND"
  },

  search: {
    changeSearchedPeople: "NEW:SEARCH_PEOPLE:PEOPLE",
    changePatternSearchPeople: "EMIT:SEARCH:PEOPLE:INPUT:CHANGE"
  },

  conference: {
    callerAddToConference: "EMIT:ADDED:SIDE",
    sideChangeConference: "ADD:SIDES:TO:CONFERENCE",
    sideLeaveConference: "REMOVE:SIDE:FROM:CONFERENCE",
    callerCloseConference: "EMIT:CLOSE:CONFERENCE",
    closeConference: "CLOSE:CONFERENCE",
    sideAlreadyCalled: "SIDE:ALREADY:CALLED",
    sideNotAvailable: "SIDE:NOT:AVAILABLE",
    sendNewPeers: "SEND:NEW:PEERS"
  },

  signaling: {
    handleWebRTCMessage: "WEB:RTC:MESSAGE",
    responseWebRTCMessage: "WEB:RTC:RESPONSE:MESSAGE",
  }
};

var userModel = require('../../mongoose/models/user');

function Root(io) {
  var clients = {};

  //connection
  io.on(Events.base.connected, function (socket) {
    console.log("this work");
    var socketUser = socket.request.user;
    if (clients[socketUser.username]) {
      clients[socketUser.username]
        .broadcast
        .to(clients[socketUser.username].roomId)
        .emit(Events.conference.sideLeaveConference, socketUser.username);
      clients[socketUser.username].emit(Events.conference.closeConference);
      clients[socketUser.username].disconnect(true);
      return clients;
    }

    clients[socketUser.username] = socket;

    refreshSocketsRoom(socket);

    socket.on(Events.base.disconnect, function () {
      socket
        .broadcast
        .to(socket.roomId)
        .emit(Events.conference.sideLeaveConference, socketUser.username);
      delete clients[socketUser.username];
    });

    socket.on(Events.userData.getUserData, function () {
      var user = _.pick(socketUser, [
        'username',
        'friends',
        'requests'
      ]);

      var groups = [];
      eachSeries(
        [user.friends, user.requests],
        function (manGroup, groupCallback) {
          var founded = [];
          eachSeries(
            manGroup,
            function (man, manCallback) {
              userModel.findById(man, function (err, found) {
                if (err) {
                  return manCallback(err);
                }
                founded.push(
                  _.pick(found, ['username'])
                );
                manCallback();
              })
            },
            function (err) {
              if (err) {
                return groupCallback(err);
              }
              groups.push(founded);
              return groupCallback();
            }
          )
        },
        function (err) {
          if (err) {
            throw(err);
          }
          user.friends = groups[0];
          user.requests = groups[1];
          socket.emit(Events.userData.newUserData, user);
        }
      );
    });

    socket.on(Events.requests.getAddingRequest, function (requestedName) {
      userModel.findOne(
        {username: socketUser.username},
        {username: 1},
        function (err, user) {
          if (err) {
            throw err;
          }
          userModel.findOne(
            {username: requestedName},
            function (err, requested) {
              if (err) {
                throw err;
              }
              const newRequests = _.union(requested.requests, [user._id]);
              requested.update(
                {$set: {requests: newRequests}, $inc: {__v: 1}},
                function (err) {
                  if (err) {
                    throw err;
                  }
                  if (clients[requested.username]) {
                    clients[requested.username].emit(
                      Events.requests.addRequestToUserSuccessful,
                      _.pick(requested.username, ['username'])
                    );
                  }
                }
              );
            }
          );
        }
      )
    });

    socket.on(Events.friends.getAddingFriend, function (friendName) {
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
                    Events.friends.addFriendToUserSuccessful,
                    _.pick(friend, ['username'])
                  );
                }
              );
            }
          );
        }
      )
    });

    socket.on(Events.friends.getRemovingFriend, function (friendName) {
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
                    Events.friends.removeFriendFromUserSuccessful,
                    friend.username
                  );
                }
              );
            }
          );
        }
      )
    });

    socket.on(Events.search.changePatternSearchPeople, function (pack) {
      var input = pack;
      if (input != '') {
        const regexFindPattern = new RegExp('^' + input + '.*', 'i');
        userModel.findOne(
          {username: socketUser.username},
          {_id: 0, username: 1, friends: 1, requests: 1},
          function (err, user) {
            const ninPattern = _.union(user.friends, user.requests);
            userModel.find(
              {
                username: {$regex: regexFindPattern, $ne: user.username},
                _id: {$nin: ninPattern}
              },
              {_id: 0, username: 1},
              function (err, result) {
                if (err) {
                  throw err;
                }
                socket.emit(Events.search.changeSearchedPeople, result);
              }
            );
          }
        );
      } else {
        socket.emit(Events.search.changeSearchedPeople, []);
      }
    });

    socket.on(Events.conference.callerAddToConference, function (side) {
      var caused = clients[side];
      if (!caused) {
        socket.emit(Events.conference.sideNotAvailable);
        return false;
      }
      if (caused.roomId === socket.roomId) {
        socket.emit(Events.conference.sideAlreadyCalled);
        return false;
      }
      io.to(caused.roomId).emit(
        Events.conference.sideChangeConference,
        getSocketsInRoom(socket.roomId).map(function (iterSocket) {
          return _.pick(iterSocket.request.user, ['username']);
        })
      );
      io.to(socket.roomId).emit(
        Events.conference.sendNewPeers,
        getSocketsInRoom(caused.roomId).map(function (iterSocket) {
          return iterSocket.request.user.username;
        })
      );
      io.to(socket.roomId).emit(
        Events.conference.sideChangeConference,
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

    socket.on(Events.conference.callerCloseConference, function () {
      socket
        .broadcast
        .to(socket.roomId)
        .emit(Events.conference.sideLeaveConference, socketUser.username);
      socket.leave(socket.roomId);
      refreshSocketsRoom(socket);
    });

    // Candidate-Offer-Answer WebRTC
    socket.on(Events.signaling.handleWebRTCMessage, function (message) {
      var data = message;
      if ((data.side !== undefined) && (clients[data.side] !== undefined)) {
        var callyClient = clients[data.side];
        data.side = socketUser.username;
        callyClient.emit(Events.signaling.responseWebRTCMessage, data);
      } else {
        data.side = socketUser.username;
        socket
          .broadcast
          .to(socket.roomId)
          .emit(Events.signaling.responseWebRTCMessage, data);
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