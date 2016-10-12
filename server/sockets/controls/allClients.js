var crypto = require('crypto');
var _ = require('lodash');

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
    sendingRequestSuccessful: "SENDING:REQUEST:SUCCESSFUL",
    removeRequestFromUserSuccessful: "REMOVE:REQUEST:FROM:USER",
    getAddingRequest: "EMIT:USER:REQUEST",
    getRemovingRequest: "EMIT:REJECTION:REQUEST"
  },

  friends: {
    addFriendToUserSuccessful: "ADD:FRIEND:TO:USER",
    removeFriendFromUserSuccessful: "REMOVE:FRIEND:FROM:USER",
    getAddingFriend: "EMIT:RESOLUTION:REQUEST",
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
    responseWebRTCMessage: "WEB:RTC:RESPONSE:MESSAGE"
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
      var user = {};
      userModel
        .findOne({username: socketUser.username})
        .populate('friends', 'username')
        .populate('requests', 'username')
        .exec(function (err, populated) {
          if (err) {
            throw(err);
          }

          const groups = ['friends', 'requests'];
          groups.forEach(function (group) {
            user[group] = populated[group].map(function (o) {
              return _.pick(o, ['username'])
            });
          });
          socket.emit(Events.userData.newUserData, user);
        });
    });

    socket.on(Events.requests.getAddingRequest, function (requestedName) {
      var user;
      userModel.findById(socketUser.id).exec()
        .then(function catchUser(caught) {
          user = caught;
          return userModel.findOne({username: requestedName}).exec();
        })
        .then(function updateRequested(requested) {
          const relSenderByRequests =
            requested.requests.some(_.isEqual.bind(null, user._id));
          if (!relSenderByRequests) {
            requested.requests.push(user._id);
            requested.markModified('requests');
          }
          return requested.save();
        })
        .then(function emitMessage(requested) {
          socket.emit(Events.requests.sendingRequestSuccessful);
          if (clients[requested.username]) {
            clients[requested.username].emit(
              Events.requests.addRequestToUserSuccessful,
              _.pick(user, ['username'])
            );
          }
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.requests.getRemovingRequest, function (requestingName) {
      var user;
      userModel.findById(socketUser.id).exec()
        .then(function catchUser(caught) {
          user = caught;
          return userModel.findOne({username: requestingName}).exec();
        })
        .then(function updateUserRequests(requesting) {
          const posReqInRequests =
            user.requests.findIndex(_.isEqual.bind(null, requesting._id));
          if (posReqInRequests != -1) {
            user.requests.splice(posReqInRequests, 1);
            user.markModified('requests');
          }
          return user.save();
        })
        .then(function emitMessage() {
          socket.emit(Events.removeRequestFromUserSuccessful, user.username);
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.friends.getAddingFriend, function (friendName) {
      var user, addingFriend;
      userModel.findOne({username: friendName}).exec()
        .then(function catchAdding(caught) {
          addingFriend = caught;
          return userModel.findById(socketUser.id).exec();
        })
        .then(function catchUser(caught) {
          return user = caught;
        })
        .then(function updateUserFriends() {
          const relAddingByFriends =
            user.friends.some(_.isEqual.bind(null, addingFriend._id));
          if (!relAddingByFriends) {
            user.friends.push(addingFriend._id);
            user.markModified('friends');
          }
          return user.save();
        })
        .then(function updateUserRequests() {
          const posAddingInRequests =
            user.requests.findIndex(_.isEqual.bind(null, addingFriend._id));
          if (posAddingInRequests != -1) {
            user.requests.splice(posAddingInRequests, 1);
            user.markModified('requests');
          }
          return user.save();
        })
        .then(function updateAddingFriends() {
          const relUserByFriends =
            addingFriend.friends.some(_.isEqual.bind(null, user._id));
          if (!relUserByFriends) {
            addingFriend.friends.push(user._id);
            addingFriend.markModified('friends');
          }
          return addingFriend.save();
        })
        .then(function emitMessage() {
          socket.emit(
            Events.friends.addFriendToUserSuccessful,
            _.pick(addingFriend, ['username'])
          );
          if (clients[addingFriend.username]) {
            clients[addingFriend.username].emit(
              Events.friends.addFriendToUserSuccessful,
              _.pick(user, ['username'])
            );
          }
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.friends.getRemovingFriend, function (friendName) {
      var user, removingFriend;
      userModel.findOne({username: friendName}).exec()
        .then(function catchRemoving(caughtFriend) {
          removingFriend = caughtFriend;
          return userModel.findById(socketUser.id).exec();
        })
        .then(function catchUser(caughtUser) {
          user = caughtUser;
        })
        .then(function updateUserFriends() {
          const posRemovingInFriends =
            user.friends.findIndex(_.isEqual.bind(null, removingFriend._id));
          if (posRemovingInFriends != -1) {
            user.friends.splice(posRemovingInFriends, 1);
            user.markModified('friends');
          }
          return user.save();
        })
        .then(function updateRemovingFriends() {
          const posUserInFriends =
            removingFriend.friends.findIndex(_.isEqual.bind(null, user._id));
          if (posUserInFriends != -1) {
            removingFriend.friends.splice(posUserInFriends, 1);
            removingFriend.markModified('friends');
          }
          return removingFriend.save();
        })
        .then(function emitMessage() {
          socket.emit(
            Events.friends.removeFriendFromUserSuccessful,
            _.pick(removingFriend, ['username'])
          );
          if (clients[removingFriend.username]) {
            clients[removingFriend.username].emit(
              Events.friends.removeFriendFromUserSuccessful,
              _.pick(user, ['username'])
            );
          }
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.search.changePatternSearchPeople, function (pack) {
      var input = escapeRegExp(pack);

      if (input != '') {
        const patternName = new RegExp('^' + input + '.*', 'i');
        userModel.findOne(
          {username: socketUser.username},
          {_id: 0, username: 1, friends: 1, requests: 1},
          function (err, user) {
            if (err) {
              throw err;
            }
            const patternRelations = _.union(user.friends, user.requests);
            userModel.find(
              {
                username: {$regex: patternName, $ne: user.username},
                _id: {$nin: patternRelations}
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

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

module.exports = Root;