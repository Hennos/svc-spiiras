var crypto = require('crypto');
var validate = require('validate.js');
var _ = require('lodash');

const events = require('../../constants/events');
const userFields = require('../../constants/fields').user;

var userModel = require('../../mongoose/models/user');

function Root(io) {
  var clients = {};

  io.on(events.base.connected, function (socket) {
    console.log("this work");
    var socketUser = socket.request.user;
    if (clients[socketUser.username]) {
      clients[socketUser.username]
        .broadcast
        .to(clients[socketUser.username].roomId)
        .emit(events.conference.sideLeaveConference, socketUser.username);
      clients[socketUser.username].emit(events.conference.closeConference);
      clients[socketUser.username].disconnect(true);
      return clients;
    }

    clients[socketUser.username] = socket;

    refreshSocketsRoom(socket);

    socket.on(events.base.disconnect, function () {
      socket
        .broadcast
        .to(socket.roomId)
        .emit(events.conference.sideLeaveConference, socketUser.username);
      delete clients[socketUser.username];
    });

    socket.on(events.userData.getUserData, function () {
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
          socket.emit(events.userData.newUserData, message);
        })
        .catch(handleError);
    });

    socket.on(events.userData.getChangeUserPreferences, function (preferences) {
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
          socket.emit(events.userData.sendSetUserPreferences, preferences);
        })
        .catch(handleError);
    });

    socket.on(events.requests.getAddingRequest, function (name) {
      const requestedName = JSON.parse(name);
      var user;
      userModel.findById(socketUser.id).exec()
        .then(function catchUser(caught) {
          user = caught;
          return userModel.findOne({username: requestedName}).exec();
        })
        .then(function updateRequested(requested) {
          const relSenderByRequests = matchArrayVal(requested.requests, user._id);
          if (!relSenderByRequests) {
            requested.requests.push(user._id);
            requested.markModified('requests');
          }
          return requested.save();
        })
        .then(function emitMessage(requested) {
          socket.emit(events.requests.sendingRequestSuccessful);
          if (clients[requested.username]) {
            var message = JSON.stringify(user, ['username']);
            clients[requested.username].emit(
              events.requests.addRequestToUserSuccessful,
              message
            );
          }
        })
        .catch(handleError);
    });

    socket.on(events.requests.getRemovingRequest, function (name) {
      const requestingName = JSON.parse(name);
      var user;
      userModel.findById(socketUser.id).exec()
        .then(function catchUser(caught) {
          user = caught;
          return userModel.findOne({username: requestingName}).exec();
        })
        .then(function updateUserRequests(requesting) {
          const posReqInRequests = posArrayVal(user.requests, requesting._id);
          if (posReqInRequests != -1) {
            user.requests.splice(posReqInRequests, 1);
            user.markModified('requests');
          }
          return user.save();
        })
        .then(function emitMessage() {
          var message = JSON.stringify(user, ['username']);
          socket.emit(events.removeRequestFromUserSuccessful, message);
        })
        .catch(handleError);
    });

    socket.on(events.friends.getAddingFriend, function (name) {
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
          const relAddingByFriends = matchArrayVal(user.friends, addingFriend._id);
          if (!relAddingByFriends) {
            user.friends.push(addingFriend._id);
            user.markModified('friends');
          }
          return user.save();
        })
        .then(function updateUserRequests() {
          const posAddingInRequests = posArrayVal(user.requests, addingFriend._id);
          if (posAddingInRequests != -1) {
            user.requests.splice(posAddingInRequests, 1);
            user.markModified('requests');
          }
          return user.save();
        })
        .then(function updateAddingFriends() {
          const relUserByFriends = matchArrayVal(addingFriend.friends, user._id);
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
            events.friends.addFriendToUserSuccessful,
            msgUser
          );
          if (clients[addingFriend.username]) {
            clients[addingFriend.username].emit(
              events.friends.addFriendToUserSuccessful,
              msgAdding
            );
          }
        })
        .catch(handleError);
    });

    socket.on(events.friends.getRemovingFriend, function (name) {
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
          const posRemovingInFriends = posArrayVal(user.friends, removingFriend._id);
          if (posRemovingInFriends != -1) {
            user.friends.splice(posRemovingInFriends, 1);
            user.markModified('friends');
          }
          return user.save();
        })
        .then(function updateRemovingFriends() {
          const posUserInFriends = posArrayVal(removingFriend.friends, user._id);
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
            events.friends.removeFriendFromUserSuccessful,
            msgUser
          );
          if (clients[removingFriend.username]) {
            clients[removingFriend.username].emit(
              events.friends.removeFriendFromUserSuccessful,
              msgRemoving
            );
          }
        })
        .catch(handleError);
    });

    socket.on(events.adminAccount.getCreateCtrlAccount, function (pack) {
      const ctrlAccData = JSON.parse(pack);
      ctrlAccData.permission = Object.assign(
        reduceMap(Object.keys(userFields.permission), false), ctrlAccData.permission);
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
            socket.emit(events.adminAccount.sendCreateCtrlAcc, msgCtrlAccount);
          })
          .catch(handleError);
      });
    });

    socket.on(events.adminAccount.getRemoveCtrlAccount, function (pack) {
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
          socket.emit(events.adminAccount.sendRemoveCtrlAcc, msgCtrlAcc);
        })
        .catch(handleError);
    });

    socket.on(events.search.changePatternSearchPeople, function (value) {
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
            socket.emit(events.search.changeSearchedPeople, message);
          })
          .catch(handleError);
      } else {
        const message = JSON.stringify([]);
        socket.emit(events.search.changeSearchedPeople, message);
      }
    });

    socket.on(events.conference.callerAddToConference, function (side) {
      var caused = clients[side];
      if (!caused) {
        socket.emit(events.conference.sideNotAvailable);
        return false;
      }
      if (caused.roomId === socket.roomId) {
        socket.emit(events.conference.sideAlreadyCalled);
        return false;
      }
      io.to(caused.roomId).emit(
        events.conference.sideChangeConference,
        getSocketsInRoom(socket.roomId).map(function (iterSocket) {
          return _.pick(iterSocket.request.user, ['username']);
        })
      );
      io.to(socket.roomId).emit(
        events.conference.sendNewPeers,
        getSocketsInRoom(caused.roomId).map(function (iterSocket) {
          return iterSocket.request.user.username;
        })
      );
      io.to(socket.roomId).emit(
        events.conference.sideChangeConference,
        getSocketsInRoom(caused.roomId).map(function (iterSocket) {
          return _.pick(iterSocket.request.user, ['username']);
        })
      );
      getSocketsInRoom(caused.roomId).forEach(function (elem) {
        elem.leave(caused.roomId, function (err) {
          if (err) {
            handleError(err);
          }
          elem.join(socket.roomId, function (err) {
            if (err) {
              handleError(err);
            }
            elem.roomId = socket.roomId;
          });
        });
      });
    });

    socket.on(events.conference.callerCloseConference, function () {
      socket
        .broadcast
        .to(socket.roomId)
        .emit(events.conference.sideLeaveConference, socketUser.username);
      socket.leave(socket.roomId);
      refreshSocketsRoom(socket);
    });

    socket.on(events.signaling.handleWebRTCMessage, function (message) {
      var data = JSON.parse(message);
      if ((data.side !== undefined) && (clients[data.side] !== undefined)) {
        var callyClient = clients[data.side];
        data.side = socketUser.username;
        callyClient.emit(
          events.signaling.responseWebRTCMessage,
          JSON.stringify(data)
        );
      } else {
        data.side = socketUser.username;
        socket
          .broadcast
          .to(socket.roomId)
          .emit(events.signaling.responseWebRTCMessage, JSON.stringify(data));
      }
    });

    function handleError(err) {
      console.error(err);
      next(err);
    }

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
          handleError(err);
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


