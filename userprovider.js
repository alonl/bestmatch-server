/**
 * This file handles the logic and DB actions related to the spotify actions.
 * User: ofer
 * Date: 06/09/13
 * Time: 21:38
 */

var mongodb = require('mongodb');
var Db = mongodb.Db;
var Connection = mongodb.Connection;
var Server = mongodb.Server;
var BSON = mongodb.BSONPure;
var ObjectID = mongodb.ObjectID;
var assert = require('assert');

MatchProvider = require('./matchprovider').MatchProvider;
var matchProvider = new MatchProvider(GLOBAL.mongo_host, GLOBAL.mongo_port);

UserProvider = function (host, port) {
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


//UserProvider.prototype.fbLogin =


UserProvider.prototype.getUsersCollection = function(callback) {
    if (!this.db.serverConfig.isConnected()) {
        callback("Db is not connected!");
        return;
    }

    this.db.collection('users', function (error, users_collection) {
        if (error) {
            callback(error);
        }
        else {
            callback(null, users_collection);
        }
    });
};

UserProvider.prototype.register = function(token, callback) {
    provider.getUsersCollection(function (error, users_collection) {
        if (error) {
            console.log("Error: Error getting users collection!");
            console.log(error);
            return;
        } else {
            users_collection.find()

            if (is_playing) { // We have a new song to record.
                var new_record = {
                    user_id: user_id,
                    song_id: song_id,
                    start_time: curr_time,
                    end_time: 0
                };
                played_intervals_collection.insert(new_record, {w: 0});
            } else { // We need to close the previous record and to calculate the song statistics.
                played_intervals_collection.find({user_id: user_id, song_id: song_id}).sort({start_time: -1}).limit(1).toArray(function (error, song_intervals) {
                    if (error) {
                        // Log this!
                        console.log("Error: Error trying to find the last song interval!");
                        console.log(error);
                        return;
                    }
                    if (song_intervals.length == 0) {
                        // Log this!
                        console.log("Error: failed to find the last song interval!");
                        return;
                    }

                    var curr_song_interval = song_intervals[0];
                    if (curr_song_interval.end_time != 0) {
                        // Log this!
                        console.log("Error: last song interval end time != 0!");
                        return;
                    }

                    played_intervals_collection.update(
                        { _id: curr_song_interval._id },
                        { $set: { end_time: curr_time } },
                        { multi: false, w: 0 }
                    );

                    provider.updateSongRatingOnEnd(user_id, song_id, curr_song_interval.start_time, curr_time);
                    return;
                });
            }
        }
    });
};


// In case of an error, calls the error handler
UserProvider.prototype.getTopSongsForUser = function (collection, user_id, top_number, sort_by, error_handler, in_callback) {
    top_number = parseInt(top_number);
    var return_results = function (error, songs_array) {
        if (error) {
            error_handler(error);
            return;
        }

        for (var i = 0; i < songs_array.length; i++) {
            songs_array[i].rank = i;
        }

        in_callback(songs_array);
    };
    if (user_id != null) {
        collection.find({user_id: user_id}).sort(sort_by).limit(top_number).toArray(return_results);
    } else {
        collection.find().sort(sort_by).limit(top_number).toArray(return_results);
    }
}

UserProvider.prototype.returnTopRated = function (recommendation_result, collection, user_id, top_number, callback) {
    var provider = this;
    // In case of an error, getTopSongsForUser calls the callback function with the error value.
    provider.getTopSongsForUser(collection, user_id, top_number, {meditation: -1}, callback, function (result) {
        recommendation_result.meditation = result;
        provider.getTopSongsForUser(collection, user_id, top_number, {engagement: -1}, callback, function (result) {
            recommendation_result.engagement = result;
            provider.getTopSongsForUser(collection, user_id, top_number, {happiness: 1}, callback, function (result) {
                recommendation_result.happiness = result;
                provider.getTopSongsForUser(collection, user_id, top_number, {excitement: -1}, callback, function (result) {
                    recommendation_result.excitement = result;
                    callback(null, recommendation_result);
                });
            });
        });
    });
};

// Get the records in user private rating table
UserProvider.prototype.getRecommendationsForUser = function (user_id, top_number, callback) {
    var recommendation_result = {
        user_id: user_id,
        top_number: top_number
    };
    var provider = this;
};

// Get the records in global rating table
UserProvider.prototype.getGlobalRecommendations = function (top_number, callback) {
    var recommendation_result = {
        top_number: top_number
    };
    var provider = this;

};


UserProvider.prototype.saveSongStatus = function (user_id, song_status_data, callback) {

    //var song_status = JSON.parse(song_status_data);
    var song_status = song_status_data;
    var song_id = song_status.current_track_id;
    var is_playing = song_status.is_playing;

    var provider = this;

    // Updates its status in the song intervals table and summarizes all of the samples into the song rating tables.
    provider.updateSongStatus(user_id, song_id, is_playing);

    provider.getSongRating(user_id, song_id, function (error, song_rating) {
        if (error) {
            callback(error);
            return;
        } else {
            callback(null, song_rating);
            return;
        }
    });
};


UserProvider.prototype.updateSongStatus = function (user_id, song_id, is_playing) {

    is_playing = ((is_playing === 'true') || (is_playing === true));

    var curr_time = new Date().getTime();
    var provider = this;


    provider.getUsersCollection(function (error, played_intervals_collection) {
        if (error) {
            // Log this!
            console.log("Error: Error getting played intervals collection!");
            console.log(error);
            return;
        }
        else {
            if (is_playing) { // We have a new song to record.
                var new_record = {
                    user_id: user_id,
                    song_id: song_id,
                    start_time: curr_time,
                    end_time: 0
                };
                played_intervals_collection.insert(new_record, {w: 0});
            } else { // We need to close the previous record and to calculate the song statistics.
                played_intervals_collection.find({user_id: user_id, song_id: song_id}).sort({start_time: -1}).limit(1).toArray(function (error, song_intervals) {
                    if (error) {
                        // Log this!
                        console.log("Error: Error trying to find the last song interval!");
                        console.log(error);
                        return;
                    }
                    if (song_intervals.length == 0) {
                        // Log this!
                        console.log("Error: failed to find the last song interval!");
                        return;
                    }

                    var curr_song_interval = song_intervals[0];
                    if (curr_song_interval.end_time != 0) {
                        // Log this!
                        console.log("Error: last song interval end time != 0!");
                        return;
                    }

                    played_intervals_collection.update(
                        { _id: curr_song_interval._id },
                        { $set: { end_time: curr_time } },
                        { multi: false, w: 0 }
                    );

                    provider.updateSongRatingOnEnd(user_id, song_id, curr_song_interval.start_time, curr_time);
                    return;
                });
            }
        }
    });
};

UserProvider.prototype.calcAveragedRating = function (old_rating, old_samples_num, new_rating, new_samples_num) {
    return (old_rating * old_samples_num + new_rating * new_samples_num) / (old_samples_num + new_samples_num);
};

UserProvider.prototype.updateSongRatingOnEnd_calcAndUpdate = function (user_id, song_id, samples) {
    var samples_number = samples.length;

    if (samples_number == 0) {
        return;
    }

    // calc average.
    var meditation = 0;
    var engagement = 0;
    var happiness = 0;
    var excitement = 0;
    for (var i = 0; i < samples_number; i++) {
        meditation += samples[i].meditation;
        engagement += samples[i].engagement;
        happiness += samples[i].happiness;
        excitement += samples[i].excitement;
    }
    meditation /= samples_number;
    engagement /= samples_number;
    happiness /= samples_number;
    excitement /= samples_number;

    var provider = this;

    // Update/create the record in global rating table
    // Asynchronious call (we don't wait for the response).

    // Update/create the record in user private rating table
    // Asynchronious call (we don't wait for the response).
};

UserProvider.prototype.updateSongRatingOnEnd = function (user_id, song_id, start_time, end_time) {
    var spotProvider = this;

    matchProvider.getEmotivCollection(function (error, samples_collection) {
        if (error) {
            // Log this!
            console.log("Error: Error getting emotive collection!");
            console.log(error);
            return;
        }
        else {
            samples_collection.find({user_id: user_id, server_time: { $gt: start_time, $lt: end_time }}
            ).toArray(function (error, relevant_samples) {
                    if (error) {
                        // Log this!
                        console.log("Error: Error trying to get the relevant samples to the time interval!");
                        console.log(error);
                        return;
                    }
                    console.info("Info: found " + relevant_samples.length + " relevant samples for the song!");
                    spotProvider.updateSongRatingOnEnd_calcAndUpdate(user_id, song_id, relevant_samples);
                });
            return;
        }
    });

};

// Retrieves the song rating, for the specific user and the song general rating.
UserProvider.prototype.getSongRating = function (user_id, song_id, callback) {
    var song_rating = {};

    var provider = this;
    // Get the record in global rating table

};


exports.UserProvider = UserProvider;