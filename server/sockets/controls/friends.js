function Friends(io) {
  var friends = io
    .of('/friends')
    .on('connection', function (socket) {
      console.log('friend connection');
      socket.on('say', function (data) {
        //console.log(socket.request.user);
        //console.log(data);
      });
    });
  return friends;
}

module.exports = Friends;