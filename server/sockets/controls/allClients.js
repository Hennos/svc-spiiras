var _ = require('lodash');
var Events = {
    connected: 'connection',
    disconnect: 'disconnect',
    getUserData: "GET:USER:DATA",
    newUserData: "NEW:USER:DATA",
    changeValueInputSearchPeople: "NEW:SEARCH_PEOPLE:VALUE"
};
var userModule = require('../../mongoose/models/user');


function Root(io) {

    var clients = [];


    //connection
    io.on(Events.connected, function (socket) {
        console.log("this work");
        _(clients).forEach(function (client) {
            console.log(client.request.user.username === socket.request.user.username);
            if (client.request.user.username === socket.request.user.username)
                client.disconnect(true);
        });


        clients.push(socket);

        socket.on(Events.disconnect, function () {
            clients.splice(clients.indexOf(socket), 1);
        });

        socket.on(Events.getUserData, function () {
            socket.emit(Events.newUserData, JSON.stringify(_.pick(socket.request.user, ['username', 'friends'])));
        });

        socket.on(Events.changeValueInputSearchPeople, function (data) {

            if (data != '') {
                userModule.find({username: new RegExp('^' + data + '.*', "i")}, {
                    "_id": 0,
                    "username": 1
                }, function (err, doc) {
                    console.log(doc);
                });

            }


            console.log(data);
        });


    });


    //userData


    return clients;
}

module.exports = Root;