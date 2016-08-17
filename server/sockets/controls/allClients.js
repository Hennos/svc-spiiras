var _ = require('lodash');
var eachSeries = require('async/eachSeries');

var Events = {
  connected: 'connection',
  disconnect: 'disconnect',
  getUserData: "GET:USER:DATA",
  addFriendToUserOnServer: "ADD:FRIEND:TO:USER:SERVER",
  removeFriendFromUserOnServer: "REMOVE:FRIEND:FROM:USER:SERVER",
  addFriendToUserOnClient: "ADD:FRIEND:TO:USER:CLIENT",
  removeFriendFromUserOnClient: "REMOVE:FRIEND:FROM:USER:CLIENT",
  newUserData: "NEW:USER:DATA",
  changePeople: "NEW:SEARCH_PEOPLE:PEOPLE",
  changePatternSearchPeople: "NEW:SEARCH_PEOPLE:VALUE",
  userChangePreferenses: "NEW:USER_PROPS_CHANGE:VALUE",
  userSetPreferences : "GET:USER_PROPS_CHANGE:VALUE"
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

    socket.on(Events.addFriendToUserOnClient, function (pack) {
      var friendName = JSON.parse(pack);
      var user = socket.request.user;
      userModel.findOne(
        {username: friendName},
        function (err, friend) {
          if (err) throw err;
          user.friends.push(friend._id);
          user.save(function (err) {
            if (err) throw err;
            socket.emit(Events.addFriendToUserOnServer, _.pick(friend, ['username']));
          });
        }
      )
    });

    socket.on(Events.removeFriendFromUserOnClient, function (pack) {
      console.log('serverIn')
      var friendName = JSON.parse(pack);
      var user = socket.request.user;
      userModel.findOne(
        {username: friendName},
        {username: 1},
        function (err, friend) {
          if (err) throw err;
          user.friends = _.filter(user.friends, function (curFriend) {
            return !(_.isEqual(curFriend, friend._id));
          });
          user.save(function (err) {
            if (err) throw err;
            console.log('serverOut')
            socket.emit(Events.removeFriendFromUserOnServer, _.pick(friend, 'username'));
          });
        }
      )
    });


    socket.on(Events.changePatternSearchPeople, function (pack) {
      var input = JSON.parse(pack);
      var user = _.pick(socket.request.user, [
        'username',
        'friends'
      ]);
      if (input != '') {
        const regexFindPattern = new RegExp('^' + input + '.*', 'i');
        userModel.find(
            {
              username: {$regex: regexFindPattern, $ne: user.username},
              _id: {$nin: user.friends}
            },
            {_id: 0, username: 1},
            function (err, result) {
              if (err) throw err;
              socket.emit(Events.changePeople, JSON.stringify(result));
            }
        );
      } else {
        socket.emit(Events.changePeople, '[]');
      }
    });
  });
  socket.on(Events.userChangePreferenses, function (pack) {
    var input = JSON.parse(pack);
    var user = socket.request.user;
    console.log(input);
    user.update({$set: {firstname: input.firstname},$set: {lastName: input.lastName},$set: {middleName: input.middleName},$set: {country: input.country},$set: {university: input.university},$set: {place: input.place},$set: {school: input.school},$set: {workplace: input.workplace}},
    function(err, result){
      if (err) throw err;
      user.save(function (err) {
        if (err) throw err;
        socket.emit(Events.userSetPreferences, _.pick(friend, 'username'));
      })
    })
  });
  //userData
  return clients;
}

module.exports = Root;