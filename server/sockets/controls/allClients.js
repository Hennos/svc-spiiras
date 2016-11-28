var crypto = require('crypto');
var _ = require('lodash');

const Events = {
  base: {
    connected: 'connection',
    disconnect: 'disconnect'
  },

  userData: {
    getUserData: "GET:USER:DATA",
    newUserData: "NEW:USER:DATA",
    getChangeUserPreferences: "EMIT:USER:PROPS:CHANGE:VALUES",
    sendSetUserPreferences: "GET:USER:PREFERENCE:VALUES"
  },

  adminAccount: {
    getCreateCtrlAccount: "EMIT:ADMIN:ACCOUNT:CREATE:VALUE",
    getRemoveCtrlAccount: "EMIT:REMOVE:CONTROL:ACCOUNT",
    sendCreateCtrlAcc: "GET:CREATE:CONTROL:ACCOUNT",
    sendRemoveCtrlAcc: "GET:REMOVE:CONTROL:ACCOUNT"
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

const Constants = {
  user: {
    permission: {
      makeCalls: 'makeCalls',
      addingFriends: 'addingFriends',
      forcedCall: "forcedCall",
      interactiveBoard: "interactiveBoard",
      passwordExitProfile: 'passwordExitProfile',
      passwordManipulationOfAudioVideo: 'passwordManipulationOfAudioVideo'
    }
  }
};

var userModel = require('../../mongoose/models/user');

function Root(io) {
  var clients = {};

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
        .populate('admined', 'username')
        .exec()
        .then(function emitMessage(populated) {
          user = Object.assign(
            user, _.pick(populated, [
              'admin',
              'username',
              'preferences',
              'permission'
            ])
          );
          const groups = ['friends', 'requests', 'admined'];
          groups.forEach(function (group) {
            user[group] = populated[group].map(function (o) {
              return [o.username, _.pick(o, ['username'])];
            });
          });
          const message = JSON.stringify(user);
          socket.emit(Events.userData.newUserData, message);
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.userData.getChangeUserPreferences, function (preferences) {
      const newPreferences = JSON.parse(preferences);
      if (Object.keys(newPreferences).length === 0) {
        return false;
      }
      userModel.findById(socketUser.id).exec()
        .then(function updatePreferences(user) {
          user.preferences = Object.assign(user.preferences, newPreferences);
          user.markModified('preferences');
          return user.save();
        })
        .then(function emitMessage() {
          socket.emit(Events.userData.sendSetUserPreferences, preferences);
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.requests.getAddingRequest, function (name) {
      const requestedName = JSON.parse(name);
      var user;
      userModel.findById(socketUser.id).exec()
        .then(function catchUser(caught) {
          user = caught;
          return userModel.findOne({username: requestedName}).exec();
        })
        .then(function updateRequested(requested) {
          const relSenderByRequests =
            matchArrayVal(requested.requests, user._id);
          if (!relSenderByRequests) {
            requested.requests.push(user._id);
            requested.markModified('requests');
          }
          return requested.save();
        })
        .then(function emitMessage(requested) {
          socket.emit(Events.requests.sendingRequestSuccessful);
          if (clients[requested.username]) {
            var message = JSON.stringify(user, ['username']);
            clients[requested.username].emit(
              Events.requests.addRequestToUserSuccessful,
              message
            );
          }
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.requests.getRemovingRequest, function (name) {
      const requestingName = JSON.parse(name);
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
          var message = JSON.stringify(user, ['username']);
          socket.emit(Events.removeRequestFromUserSuccessful, message);
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.friends.getAddingFriend, function (name) {
      const friendName = JSON.parse(name);
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
            matchArrayVal(user.friends, addingFriend._id);
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
            matchArrayVal(addingFriend.friends, user._id);
          if (!relUserByFriends) {
            addingFriend.friends.push(user._id);
            addingFriend.markModified('friends');
          }
          return addingFriend.save();
        })
        .then(function emitMessage() {
          var msgUser = JSON.stringify(addingFriend, ['username']);
          var msgAdding = JSON.stringify(user, ['username']);
          socket.emit(
            Events.friends.addFriendToUserSuccessful,
            msgUser
          );
          if (clients[addingFriend.username]) {
            clients[addingFriend.username].emit(
              Events.friends.addFriendToUserSuccessful,
              msgAdding
            );
          }
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.friends.getRemovingFriend, function (name) {
      const friendName = JSON.parse(name);
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
          var msgUser = JSON.stringify(removingFriend, ['username']);
          var msgRemoving = JSON.stringify(user, ['username']);
          socket.emit(
            Events.friends.removeFriendFromUserSuccessful,
            msgUser
          );
          if (clients[removingFriend.username]) {
            clients[removingFriend.username].emit(
              Events.friends.removeFriendFromUserSuccessful,
              msgRemoving
            );
          }
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.adminAccount.getCreateCtrlAccount, function (pack) {
      const ctrlAccData = JSON.parse(pack);
      ctrlAccData.permission = Object.assign(
        reduceMap(Object.keys(Constants.user.permission), false), ctrlAccData.permission);
      userModel.register(new userModel({
        username: ctrlAccData.username,
        email: ctrlAccData.email,
        permission: Object.assign({}, ctrlAccData.permission)
      }), ctrlAccData.password, function (error, account) {
        if (error) {
          return console.error(error);
        }
        userModel.findById(socketUser.id).exec()
          .then(function addCtrlAccToUser(user) {
            user.admined.push(account.id);
            user.markModified('admined');
            return user.save();
          })
          .then(function emitMessage() {
            const msgCtrlAccount = JSON.stringify(
              _.pick(account, ['username', 'email', 'permission'])
            );
            socket.emit(Events.adminAccount.sendCreateCtrlAcc, msgCtrlAccount);
          })
          .catch(function handleError(err) {
            throw err;
          });
      });
    });

    socket.on(Events.adminAccount.getRemoveCtrlAccount, function (pack) {
      const ctrlAccName = JSON.parse(pack);
      var removingCtrlAcc;
      userModel.findOne({username: ctrlAccName}).exec()
        .then(function catchRemoving(caughtCtrlAcc) {
          removingCtrlAcc = caughtCtrlAcc;
          return userModel.findById(socketUser.id).exec()
        })
        .then(function updateUserAdmined(caughtUser) {
          const posRemovingInAdmined = posArrayVal(caughtUser.admined, removingCtrlAcc._id);
          if (posRemovingInAdmined != -1) {
            caughtUser.admined.splice(posRemovingInAdmined, 1);
            caughtUser.markModified('admined');
          }
          return caughtUser.save();
        })
        .then(function removeCtrlAcc() {
          return removingCtrlAcc.remove()
        })
        .then(function emitMessage() {
          const msgCtrlAcc = JSON.stringify(ctrlAccName);
          socket.emit(Events.adminAccount.sendRemoveCtrlAcc, msgCtrlAcc);
        })
        .catch(function handleError(err) {
          throw err;
        });
    });

    socket.on(Events.search.changePatternSearchPeople, function (value) {
      const input = escapeRegExp(JSON.parse(value));
      if (input != '') {
        userModel.findById(socketUser.id).exec()
          .then(function findPeople(user) {
            const patternName = new RegExp('^' + input + '.*', 'i');
            const patternRelations = _.union(user.friends, user.requests);
            return userModel.find({
              username: {$regex: patternName, $ne: user.username},
              _id: {$nin: patternRelations}
            }).exec();
          })
          .then(function emitMessage(result) {
            const message = JSON.stringify(result, ['username']);
            socket.emit(Events.search.changeSearchedPeople, message);
          })
          .catch(function handleError(err) {
            throw err;
          });
      } else {
        const message = JSON.stringify([]);
        socket.emit(Events.search.changeSearchedPeople, message);
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
      var data = JSON.parse(message);
      if ((data.side !== undefined) && (clients[data.side] !== undefined)) {
        var callyClient = clients[data.side];
        data.side = socketUser.username;
        callyClient.emit(
          Events.signaling.responseWebRTCMessage,
          JSON.stringify(data)
        );
      } else {
        data.side = socketUser.username;
        socket
          .broadcast
          .to(socket.roomId)
          .emit(Events.signaling.responseWebRTCMessage, JSON.stringify(data));
      }
    });

    function getSocketsInRoom(roomId) {
      var res = [],
        room = io.sockets.adapter.rooms[roomId];
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

    function reduceMap(fields, value) {
      return fields.reduce(function (previous, property) {
        var current = Object.assign({}, previous);
        current[property] = value;
        return current;
      }, {});
    }

    function matchArrayVal(array, value) {
      return array.some(_.isEqual.bind(null, value));
    }

    function posArrayVal(array, value) {
      return array.findIndex(_.isEqual.bind(null, value));
    }
  });

  return clients;
}

module.exports = Root;


