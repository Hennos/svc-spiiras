var nconf = require('nconf');
var mongoose = require('mongoose');


var options = nconf.get('database');

mongoose.connect(options.host + '/' + options.name);
var mongooseConnection = mongoose.connection;
var User = require('./models/user');
var _ = require('underscore');


mongooseConnection.on('error', function (err) {

    console.error('Database connection failed.', err);
    throw err;
});

mongooseConnection.on('open', function (cb) {
    console.info('Database connection established.');


/*    User.find({}, 'username', function (err, docs) {
        var _ids = _.pluck(docs, '_id');
        var names = _.pluck(docs, 'username');

        console.log(names);



        _.each(names, function (name) {

            var allNames = _.without(names, name);

            User.update({username:name}, {$set:{friends:_ids}}, function(err){
                if(err)
                    console.error(err);
            });

        });

    });*/

});

module.exports = mongooseConnection;