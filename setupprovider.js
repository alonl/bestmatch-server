
var mongodb = require('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;
var ObjectID = mongodb.ObjectID;
var assert = require('assert');

SetupProvider = function (host, port) {
    var provider = this;
    var connectionString = process.env.CUSTOMCONNSTR_MONGOLAB_URI || "mongodb://127.0.0.1:27017";
    Db.connect(connectionString, function(err, db1) {
        if (err) {
            console.log(err);
        } else {
            provider.db = db1;
        }
    });
};

MatchProvider = require('./matchprovider').MatchProvider;
var matchProvider = new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);

// Resets the DB
SetupProvider.prototype.reset = function (callback) {

    var provider = this;
    this.db.collection('emotiv_samples', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('spotify_played_intervals', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('spotify_global_rating', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('spotify_private_rating', function(err, collection) {
        collection.remove({}, {w: 0});
    });
    this.db.collection('users', function(err, collection) {
        collection.remove({},{w:1}, function(error, removedNum){
            console.log("removed " + removedNum + " user records.");
            matchProvider.getUserCollection(function (error, users_collection) {
                if (error) {
                    // Log this!
                    console.log("Error: Error getting global rating collection!");
                    console.log(error);
                    callback(error);
                }
                else {
                    users_collection.insert({user_id: 0, last_sample_time:0, last_volume_action:0, last_song_action:0}, {w: 0});
                    provider.insertSongsData(callback);
                }
            });
        });
    });
};

// Inserts songs data into the DB
SetupProvider.prototype.insertSongsData = function (callback) {
    var users_counter = 0;
    var global_counter = 0;

    var users_data = SONGS_DATA.users;
    var global_data = SONGS_DATA.global;

    userProvider.getGlobalRatingCollection(function (error, global_rating_collection) {
        if (error) {
            // Log this!
            console.log("Error: Error getting global rating collection!");
            console.log(error);
            callback(error);
        } else {
            global_data.forEach(function(song_data) {
                var record = {
                    song_id:song_data.track_id,
                    samples_num: 10000,
                    meditation: song_data.meditation,
                    engagement:song_data.engagement,
                    happiness:song_data.happiness,
                    excitement:song_data.excitement
                };

                global_rating_collection.insert(record, {w: 0});
                global_counter++;
            });
        }
    });

    userProvider.getPrivateRatingCollection(function (error, private_rating_collection) {
        if (error) {
            // Log this!
            console.log("Error: Error getting global rating collection!");
            console.log(error);
            callback(error);
        } else {
            users_data.forEach(function(song_data) {
                var record = {
                    song_id:song_data.track_id,
                    user_id:song_data.user_id,
                    samples_num: 3000,
                    meditation: song_data.meditation,
                    engagement:song_data.engagement,
                    happiness:song_data.happiness,
                    excitement:song_data.excitement
                };

                private_rating_collection.insert(record, {w: 0});
                users_counter++;
            });
        }
    });

    callback(null,users_counter, global_counter);
};

exports.SetupProvider = SetupProvider;